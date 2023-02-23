/*
    plasma-mobile-nightly-build-script: Sineware ProLinux project to produce nightly development packages of Plasma Mobile
    Copyright (C) 2022  Seshan Ravikumar

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
require('dotenv').config()

import path from "path";
import { parsePackageDependencies } from "./apkbuild-parser/parser";
import { repository, globalPatches } from "./apkbuild-parser/repo";
import exec from "./helpers/exec";
import { Package } from "./helpers/types";

const WORKDIR = path.join(process.cwd(), "workdir");
const ABUILD_WRAPPER = path.join(__dirname, "abuild-wrapper.sh");
const ALPINE_APORTS_REPO = "https://gitlab.alpinelinux.org/alpine/aports.git";
const ARCH = process.env.BUILD_ARCH ?? exec("uname -m", false).toString().trim();

let builtList: string[] = [];

console.log("WORKDIR: " + WORKDIR);
console.log("ABUILD_WRAPPER: " + ABUILD_WRAPPER);
console.log("ALPINE_APORTS_REPO: " + ALPINE_APORTS_REPO);
console.log("ARCH: " + ARCH);

let buildStep = "";

(async () => {
    try {
        console.log("💤 Starting Plasma Mobile Nightly build at " + new Date().toLocaleString());
        exec("mkdir -pv " + WORKDIR);
        process.chdir(WORKDIR);

        console.log("🔧 Upgrading Alpine");
        exec("sudo apk upgrade");

        // Clone aports repository from git, or pull if it already exists
        console.log("📦 Cloning aports repository");
        buildStep = "clone-aports";
        exec(`git -C aports pull || git clone ${ALPINE_APORTS_REPO} aports`);

        exec("mkdir -pv prolinux-nightly");
        
        if(process.env.BUILD_SINGLE_PACKAGE) {
            console.log("📦 Building single package " + process.env.BUILD_SINGLE_PACKAGE);
            buildStep = "build-single-package";
            if(!repository.has(process.env.BUILD_SINGLE_PACKAGE)) {
                throw new Error("Package not found in repo.ts");
            }
            await buildPackage(repository.get(process.env.BUILD_SINGLE_PACKAGE)!);
        } else {
            // Get list from repository or the environment variable PACKAGE_LIST
            let packages: string[] = [];
            if(process.env.PACKAGE_LIST) {
                packages = process.env.PACKAGE_LIST.split(",");
            } else {
                packages = Array.from(repository.keys());
            }
            console.log("📦 Package list: " + packages.join(", "));
            let repoTotal = 0;
            for (const pkg of packages) {
                let fullList = parsePackageDependencies(pkg).filter((p) => repository.has(p));
                // Also parse dependencies of extraDepends and add them to fullList
                if(repository.get(pkg)?.extraDepends) {
                    for (const extraDepend of repository.get(pkg)!.extraDepends!) {
                        fullList = [...fullList, ...parsePackageDependencies(extraDepend).filter((p) => repository.has(p))];
                    }
                }
                console.log("📦 Building " + pkg + " with dependencies: " + fullList.join(", "));
                let total = 0;
                for (const d of fullList) {
                    await buildPackage(repository.get(d)!);
                    total++;
                    console.log("⏳ Built " + total + " of " + fullList.length + " dependencies for target " + pkg + " (" + repoTotal + "/" + repository.size + ")");
                }
                console.log("✅ Built " + total + " packages for target " + pkg);
                repoTotal++;
            }
        }

        // Deploy files
        buildStep = "deploy";
        console.log("🚀 Deploying files");
        exec(`rsync -aHAXxv --delete --progress ~/packages/prolinux-nightly/${ARCH} espimac:/var/www/sineware/repo/alpine/prolinux-nightly/`);

        buildStep = `finish`;
    } catch (e) {
        console.error("❌ Build failed at step " + buildStep + ": " + e);
        process.exit(1);
    }
})();

async function buildPackage(pkg: Package) {
    try {
        console.log("📦 -> Building " + pkg.name);
        // return if already built
        if (builtList.includes(pkg.name)) {
            console.log("📦 -> Already built, skipping");
            return;
        }
        // return if skipBuild is true
        if (pkg.skipBuild && !process.env.PACKAGE_LIST?.split(",").includes(pkg.name) && !process.env.BUILD_SINGLE_PACKAGE) {
            console.log("📦 -> Skip build is true, skipping");
            return;
        }

        buildStep = `build-${pkg.name}-begin`;
        // clone the package repository
        const pkgDir = path.join(WORKDIR, "prolinux-nightly", pkg.name);
        const aportsPkgDir = path.join(WORKDIR, "aports", pkg.aports_repo, pkg.name);

        // check if rebuilding is necessary by compare rev-parse of local and remote
        try {
            exec(`git -C ${pkgDir}/src/${pkg.name} fetch`);
            let branch = process.env.BUILD_SINGLE_PACKAGE_BRANCH ?? "kf5";
            try {
                exec(`git -C ${pkgDir}/src/${pkg.name} checkout ` + branch);
                console.log("🔧   -> Using " + branch + " branch");
            } catch {
                console.log("🔧   -> Using master branch");
            }
            const remoteRev = exec(`git -C ${pkgDir}/src/${pkg.name} rev-parse @{u}`, false).toString().trim();
            const localRev = exec(`git -C ${pkgDir}/src/${pkg.name} rev-parse @`, false).toString().trim();
            if (remoteRev === localRev) {
                console.log("📦 -> Already up to date (upstream), skipping");
                return;
            } else {
                console.log("📦 -> New commits found, rebuilding");
                console.log(`      ->Deleting ${pkgDir}`)
                exec(`rm -rf ${pkgDir}`);
            }
        } catch {
            console.log("📦 -> Not cloned, cloning");
        }

        console.log(`📦 -> Deleting ${pkgDir}`)
        exec(`rm -rf ${pkgDir}`);

        console.log("🔧   -> Clone package repository");
        buildStep = `build-${pkg.name}-clone`;
        try {
            exec(`mkdir -pv ${pkgDir}/src/${pkg.name}`);
            exec(`git clone ${pkg.repo} ${pkgDir}/src/${pkg.name}`);  
        } catch (e) {
            console.log(e);
            console.log("🔧   -> Clone failed?");
        }

        // check if the "kf5" branch exists, if so, use it
        try {
            exec(`git -C ${pkgDir}/src/${pkg.name} checkout kf5`);
            console.log("🔧   -> Using kf5 branch");
        } catch {
            console.log("🔧   -> Using master branch");
        }
        
        // Check if git commit message contains GIT_SILENT
        /*const gitLog = exec(`git -C ${pkgDir}/src/${pkg.name} log -1 --pretty=%B`, false).toString().trim();
        if (gitLog.includes("GIT_SILENT") && process.env.IGNORE_GIT_SILENT !== "true") {
            console.log("📦 -> GIT_SILENT found, skipping");
            return;
        }*/

        buildStep = `build-${pkg.name}-pre-patch`;
        // copy patches/extra files from aports to src
        exec(`cp -rv ${aportsPkgDir}/* ${pkgDir}/src/`);

        exec(`cp -v ${aportsPkgDir}/APKBUILD ${pkgDir}/APKBUILD`);
        const pkgVer = "9999_git" + (exec(`cd ${pkgDir}/src/${pkg.name} && git show -s --format=%ct`, false).toString().trim());
        console.log("🔧   -> Patching APKBUILD with pkgver " + pkgVer);

        buildStep = `build-${pkg.name}-patch`;
        exec(`sed -i '/pkgver=/c\pkgver=${pkgVer}' ${pkgDir}/APKBUILD`);
        exec(`sed -i 's/$pkgname-lang//g' ${pkgDir}/APKBUILD`);
        // run global patches
        for (const patch of globalPatches) {
            console.log("🔧   -> Patching with " + patch.cmd);
            if(patch.runInDir) {
                exec(`cd ${pkgDir} && ${patch.cmd}`);
            } else {
                exec(patch.cmd);
            }
        }
        // per package patch set
        if(pkg.patches) {
            for (const patch of pkg.patches) {
                console.log("🔧   -> Patching" + " with " + patch.cmd);
                exec(patch.cmd);
            }
        }

        buildStep = `build-${pkg.name}-repolink`;
        exec(`ln -svf ${pkgDir}/src/${pkg.name} ${pkgDir}/src/${pkg.name}-${pkgVer}`);

        // build the package
        console.log("🔧   -> Building package");
        buildStep = `build-${pkg.name}-apk-pre-abuild`;
        // prepare, deps, build, rootpkg, index
        exec(`sudo apk update`); // ensures we are using the latest packages we compiled earlier

        // apk add packages from extraDepends
        if(pkg.extraDepends) {
            for (const dep of pkg.extraDepends) {
                console.log("🔧   -> Installing extra dependency " + dep);
                exec(`sudo apk add ${dep}`);
            }
        }

        // abuild
        buildStep = `build-${pkg.name}-abuild`;
        exec(`cd ${pkgDir} && abuild -F prepare`);
        exec(`cd ${pkgDir} && abuild -F deps`);
        exec(`cd ${pkgDir} && abuild -F build`, true, (process.env.DISTCC_SETTINGS === "true" && !pkg.dontDistcc) ? {
            "ARCH": ARCH,
            "CMAKE_BUILD_PARALLEL_LEVEL": "40",
            "MAKEFLAGS": "-j40",
            "CC": "ccache distcc",
            "CXX": "ccache distcc g++",
        } : (pkg.name === "kio") ? {
            "ARCH": ARCH,
        } : {
            "ARCH": ARCH,
            "CC": "ccache gcc",
            "CXX": "ccache g++",
        });

        // clear old packages from ~/packages/prolinux-nightly/${ARCH}
        console.log("📦 -> Clearing old packages");
        // todo this matches wrong (breeze-* matches breeze-grub etc)
        exec(`rm -rfv ~/packages/prolinux-nightly/${ARCH}/${pkg.name}-9999*`);
        exec(`rm -rfv ~/packages/prolinux-nightly/${ARCH}/${pkg.name}-dev-9999*`);
        exec(`rm -rfv ~/packages/prolinux-nightly/${ARCH}/${pkg.name}-libs-9999*`);
        exec(`rm -rfv ~/packages/prolinux-nightly/${ARCH}/${pkg.name}-doc-9999*`);
        exec(`rm -rfv ~/packages/prolinux-nightly/${ARCH}/${pkg.name}-lang-9999*`);
        exec(`rm -rfv ~/packages/prolinux-nightly/${ARCH}/${pkg.name}-dbg-9999*`);

        exec(`rm -rfv ~/packages/prolinux-nightly/${ARCH}/plasma-nm-mobile-9999*`);
        exec(`rm -rfv ~/packages/prolinux-nightly/${ARCH}/knetattach-9999*`);
        exec(`rm -rfv ~/packages/prolinux-nightly/${ARCH}/kio-kwallet-9999*`);

        exec(`cd ${pkgDir} && abuild -F rootpkg`);
        exec(`cd ${pkgDir} && abuild -F index`);
        exec(`cd ${pkgDir} && abuild -F undeps`);

        // apk del packages from extraDepends
        buildStep = `build-${pkg.name}-apk-post-abuild`;
        if(pkg.extraDepends) {
            for (const dep of pkg.extraDepends) {
                console.log("🔧   -> Removing extra dependency " + dep);
                exec(`sudo apk del ${dep}`);
            }
        }

        builtList.push(pkg.name);
    } catch (e) {
        console.error("❌ (buildPackage()) Failed to compile " + pkg.name);
        // remove pkg folder
        exec(`sudo apk del .makedepends-${pkg.name}`);
        const pkgDir = path.join(WORKDIR, "prolinux-nightly", pkg.name);
        //exec(`rm -rf ${pkgDir}`);
        throw e;
    }
}
