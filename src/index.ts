/*
    Plasma Mobile Nightly
    Sineware ProLinux project to produce nightly development packages of Plasma Mobile
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
import fs from "fs";
import { parsePackageDependencies } from "./apkbuild-parser/parser";
import { repository } from "./apkbuild-parser/repo";
import exec from "./helpers/exec";
import { Package } from "./helpers/types";

//const WORKDIR = path.join(process.cwd(), "workdir");
const ABUILD_WRAPPER = path.join(__dirname, "abuild-wrapper.sh");
const ALPINE_APORTS_REPO = "https://gitlab.alpinelinux.org/alpine/aports.git";

const ARCH = process.env.SW_ARCH; // x86_64, aarch64
const CHROOT_DIR = process.env.SW_CHROOT_DIR; 

// ----------------- //

console.log("🔨 Verifying build environment...");
if (!ARCH || !CHROOT_DIR) {
    console.error("❌ Environment variables are not set");
    process.exit(1);
}
// check if chroot dir exists
if (!fs.existsSync(CHROOT_DIR)) {
    console.error("❌ CHROOT_DIR does not exist");
    process.exit(1);
}

// Runs comamnd as root in chroot
const execChroot = (cmd: string) => {
    console.log(`🔨 Entering chroot (root)`);
    return exec(`sudo chroot ${CHROOT_DIR} su root -c "${cmd}"`);
}
// Runs command as swadmin in chroot
const execChrootUser = (cmd: string) => {
    console.log(`🔨 Entering chroot (swadmin)`);
    return exec(`sudo chroot ${CHROOT_DIR} su swadmin -c "${cmd}"`);
}

// check if abuild is installed
try {
    execChrootUser("abuild -h");
} catch (e) {
    console.error(e);
    console.error("❌ Failed to run abuild in chroot!");
    process.exit(1);
}
console.log("✅ Build environment verified");

const CHROOT_DIR_SWADMIN_HOME = path.join(CHROOT_DIR, "home", "swadmin");
const WORKDIR = path.join(CHROOT_DIR_SWADMIN_HOME, "workdir");

// ----------------- //

let builtList: string[] = [];
let buildList = [];

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
        execChroot("apk upgrade");

        // Clone aports repository from git, or pull if it already exists
        console.log("📦 Cloning aports repository");
        buildStep = "clone-aports";
        exec(`git -C aports pull || git clone ${ALPINE_APORTS_REPO} aports`);

        exec("mkdir -pv prolinux-nightly");        

        console.log("📦 Package list: " + Array.from(repository.keys()).join(", "));
        let repoTotal = 0;
        for (const pkg of repository.keys()) {
            let fullList = parsePackageDependencies(pkg).filter((p) => repository.has(p));
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

        // Deploy files
        buildStep = "deploy";
        console.log("🚀 Deploying files");
        exec(`rsync -aHAXxv --delete --progress ${CHROOT_DIR_SWADMIN_HOME}/packages/prolinux-nightly/${ARCH} espimac:/var/www/sineware/repo/alpine/prolinux-nightly/`);

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

        const pkgDirChroot = path.join("/home/swadmin/workdir", "prolinux-nightly", pkg.name);
        const aportsPkgDirChroot = path.join("/home/swadmin/workdir", "aports", pkg.aports_repo, pkg.name);

        // check if rebuilding is necessary by compare rev-parse of local and remote
        
        try {
            exec(`git -C ${pkgDir}/src/${pkg.name} fetch`);
            const remoteRev = exec(`git -C ${pkgDir}/src/${pkg.name} rev-parse @{u}`, false).toString().trim();
            const localRev = exec(`git -C ${pkgDir}/src/${pkg.name} rev-parse @`, false).toString().trim();
            if (remoteRev === localRev) {
                console.log("📦 -> Already up to date (upstream), skipping");
                return;
            } else {
                console.log("📦 -> New commits found, rebuilding");
                exec(`rm -rfv ${pkgDir}`);
            }
        } catch {
            console.log("📦 -> Not cloned, cloning");
        }
        

        console.log("🔧   -> Clone package repository");
        buildStep = `build-${pkg.name}-clone`;
        exec(`mkdir -pv ${pkgDir}/src/${pkg.name}`);
        exec(`git clone ${pkg.repo} ${pkgDir}/src/${pkg.name}`);        

        buildStep = `build-${pkg.name}-pre-patch`;
        // copy patches/extra files from aports to src
        exec(`cp -rv ${aportsPkgDir}/* ${pkgDir}/src/`);

        exec(`cp -v ${aportsPkgDir}/APKBUILD ${pkgDir}/APKBUILD`);
        const pkgVer = "9999_git" + (exec(`cd ${pkgDir}/src/${pkg.name} && git show -s --format=%ct`, false).toString().trim());
        console.log("🔧   -> Patching APKBUILD with pkgver " + pkgVer);

        buildStep = `build-${pkg.name}-patch`;
        exec(`sed -i '/pkgver=/c\pkgver=${pkgVer}' ${pkgDir}/APKBUILD`);
        exec(`sed -i 's/$pkgname-lang//g' ${pkgDir}/APKBUILD`);
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
        execChroot(`apk update`); // ensures we are using the latest packages we compiled earlier

        // apk add packages from extraDepends
        if(pkg.extraDepends) {
            for (const dep of pkg.extraDepends) {
                console.log("🔧   -> Installing extra dependency " + dep);
                execChroot(`apk add ${dep}`);
            }
        }

        // abuild
        buildStep = `build-${pkg.name}-abuild`;
        execChrootUser(`cd ${pkgDirChroot} && abuild prepare`);
        execChroot(`cd ${pkgDirChroot} && abuild -F deps`);
        execChrootUser(`cd ${pkgDirChroot} && abuild build`);

        // clear old packages from ~/packages/prolinux-nightly/${ARCH}
        console.log("📦 -> Clearing old packages");
        // todo this matches wrong (breeze-* matches breeze-grub etc)
        exec(`rm -rfv ${CHROOT_DIR_SWADMIN_HOME}/packages/prolinux-nightly/${ARCH}/${pkg.name}-9999*`);
        exec(`rm -rfv ${CHROOT_DIR_SWADMIN_HOME}/packages/prolinux-nightly/${ARCH}/${pkg.name}-dev-9999*`);
        exec(`rm -rfv ${CHROOT_DIR_SWADMIN_HOME}/packages/prolinux-nightly/${ARCH}/${pkg.name}-libs-9999*`);
        exec(`rm -rfv ${CHROOT_DIR_SWADMIN_HOME}/packages/prolinux-nightly/${ARCH}/${pkg.name}-doc-9999*`);
        exec(`rm -rfv ${CHROOT_DIR_SWADMIN_HOME}/packages/prolinux-nightly/${ARCH}/${pkg.name}-lang-9999*`);

        execChrootUser(`cd ${pkgDirChroot} && abuild rootpkg`);
        execChrootUser(`cd ${pkgDirChroot} && abuild index`);
        execChroot(`cd ${pkgDirChroot} && abuild -F undeps`);

        // apk del packages from extraDepends
        buildStep = `build-${pkg.name}-apk-post-abuild`;
        if(pkg.extraDepends) {
            for (const dep of pkg.extraDepends) {
                console.log("🔧   -> Removing extra dependency " + dep);
                execChroot(`apk del ${dep}`);
            }
        }

        builtList.push(pkg.name);
    } catch (e) {
        console.error("❌ (buildPackage()) Failed to compile " + pkg.name);
        // remove pkg folder
        execChroot(`apk del .makedepends-${pkg.name}`);
        const pkgDir = path.join(WORKDIR, "prolinux-nightly", pkg.name);
        //exec(`rm -rf ${pkgDir}`);
        throw e;
    }
}