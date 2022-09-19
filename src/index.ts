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
import { repository } from "./apkbuild-parser/repo";
import exec from "./helpers/exec";
import { Package } from "./helpers/types";

const WORKDIR = path.join(process.cwd(), "workdir");
const ABUILD_WRAPPER = path.join(__dirname, "abuild-wrapper.sh");
const ALPINE_APORTS_REPO = "https://gitlab.alpinelinux.org/alpine/aports.git";
if(process.env.BUILD_ALL === "true") {
    process.exit(1);
}
let builtList: string[] = [];
let buildList = [
    "plasma-wayland-protocols", // required by kidletime, a dependancy of plasma-mobile
    "plasma-mobile"
];

console.log("WORKDIR: " + WORKDIR);
console.log("ABUILD_WRAPPER: " + ABUILD_WRAPPER);
console.log("ALPINE_APORTS_REPO: " + ALPINE_APORTS_REPO);

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
        //exec("rm -rfv prolinux-nightly/*"); // todo speed up build by checking if new git commits

        // clear repository folder
        exec("rm -rfv ~/packages/prolinux-nightly/*");
        

        console.log("📦 Package list: " + buildList);
        for (const pkg of buildList) {
            let fullList = parsePackageDependencies(pkg).filter((p) => repository.has(p));
            console.log("📦 Building " + pkg + " with dependencies: " + fullList.join(", "));
            let total = 0;
            for (const d of fullList) {
                await buildPackage(repository.get(d)!);
                total++;
                console.log("⏳ Built " + total + " of " + fullList.length);
            }
        }

        // Deploy files
        buildStep = "deploy";
        console.log("🚀 Deploying files");
        exec("rsync -aHAXxv --delete --progress ~/packages/prolinux-nightly espimac:/var/www/sineware/repo/alpine/");

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

        buildStep = `build-${pkg.name}-begin`;
        // clone the package repository
        const pkgDir = path.join(WORKDIR, "prolinux-nightly", pkg.name);
        const aportsPkgDir = path.join(WORKDIR, "aports", pkg.aports_repo, pkg.name);

        // check if rebuilding is nessesary by compare rev-parse of local and remote
        
        try {
            const remoteRev = exec(`git -C ${pkgDir}/src/${pkg.name} rev-parse @{u}`, false).toString().trim();
            const localRev = exec(`git -C ${pkgDir}/src/${pkg.name} rev-parse @`, false).toString().trim();
            if (remoteRev === localRev) {
                console.log("📦 -> Already up to date (upstream), skipping");
                return;
            } else {
                console.log("📦 -> New commits found, rebuilding");
                exec("rm -rfv ${pkgDir}");
            }
        } catch {
            console.log("📦 -> Not cloned, cloning");
        }
        

        console.log("🔧   -> Clone package repository");
        buildStep = `build-${pkg.name}-clone`;
        exec(`mkdir -pv ${pkgDir}/src/${pkg.name}`);
        exec(`git clone ${pkg.repo} ${pkgDir}/src/${pkg.name}`);        

        buildStep = `build-${pkg.name}-pre-patch`;
        exec(`cp -v ${aportsPkgDir}/APKBUILD ${pkgDir}/APKBUILD`);
        const pkgVer = "9999_git" + (exec(`cd ${pkgDir}/src/${pkg.name} && git show -s --format=%ct`, false).toString().trim());
        console.log("🔧   -> Patching APKBUILD with pkgver " + pkgVer);
        buildStep = `build-${pkg.name}-patch`;
        exec(`sed -i '/pkgver=/c\pkgver=${pkgVer}' ${pkgDir}/APKBUILD`);
        exec(`sed -i 's/ $pkgname-lang//g' ${pkgDir}/APKBUILD`);
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
        buildStep = `build-${pkg.name}-abuild`;
        // prepare, deps, build, rootpkg, index
        exec(`sudo apk update`); // ensures we are using the latest packages we compiled earlier
        exec(`cd ${pkgDir} && abuild prepare`);
        exec(`cd ${pkgDir} && abuild deps`);
        exec(`cd ${pkgDir} && abuild build`);
        exec(`cd ${pkgDir} && abuild rootpkg`);
        exec(`cd ${pkgDir} && abuild index`);
        exec(`cd ${pkgDir} && abuild undeps`);

        builtList.push(pkg.name);
    } catch (e) {
        console.error("❌ Failed to compile " + pkg.name);
        // remove pkg folder
        exec("rm -rfv ${pkgDir}");
        throw e;
    }
}