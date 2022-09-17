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
import path from "path";
import { parsePackageDependencies } from "./apkbuild-parser/parser";
import { repository } from "./apkbuild-parser/repo";
import exec from "./helpers/exec";
import { Package, Patch } from "./helpers/types";


const WORKDIR = path.join(process.cwd(), "workdir");
const ABUILD_WRAPPER = path.join(__dirname, "abuild-wrapper.sh");
const ALPINE_APORTS_REPO = "https://gitlab.alpinelinux.org/alpine/aports.git";

const PATCH_REMOVE_LANG: Patch = {sedString: '/subpackages=/c\subpackages="$pkgname-dev $pkgname-doc"', file: "APKBUILD"};

let builtList: string[] = [];
let buildList = ["plasma-mobile"]

// todo fill buildList with all packages and dependencies for plasma-mobile
/*let buildList: Package[] = [
    //{name: "breeze-icons", repo: "https://invent.kde.org/frameworks/breeze-icons.git", aports_repo: "community"},
    { name: "kactivities", repo: "https://invent.kde.org/frameworks/kactivities.git", aports_repo: "community",
        depends: [
            {name: "kconfig", repo: "https://invent.kde.org/frameworks/kconfig.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
            {name: "kcoreaddons", repo: "https://invent.kde.org/frameworks/kcoreaddons.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
            {name: "kwindowsystem", repo: "https://invent.kde.org/frameworks/kwindowsystem.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
        ]
    },
    { name: "kauth", repo: "https://invent.kde.org/frameworks/kauth.git", aports_repo: "community" },
    {name: "kbookmarks", repo: "https://invent.kde.org/frameworks/kbookmarks.git", aports_repo: "community", 
        depends: [
            {name: "kcodecs", repo: "https://invent.kde.org/frameworks/kcodecs.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
            {name: "kconfig", repo: "https://invent.kde.org/frameworks/kconfig.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
            {name: "kconfigwidgets", repo: "https://invent.kde.org/frameworks/kconfigwidgets.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
        ]
    },
    {name: "kcodecs", repo: "https://invent.kde.org/frameworks/kcodecs.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
    {name: "kcompletion", repo: "https://invent.kde.org/frameworks/kcompletion.git", aports_repo: "community", 
        depends: [
            {name: "kwidgetsaddons", repo: "https://invent.kde.org/frameworks/kwidgetsaddons.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
            {name: "kconfig", repo: "https://invent.kde.org/frameworks/kconfig.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
        ]
    },
    {name: "kconfig", repo: "https://invent.kde.org/frameworks/kconfig.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
    {name: "kconfigwidgets", repo: "https://invent.kde.org/frameworks/kconfigwidgets.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
    {name: "kcoreaddons", repo: "https://invent.kde.org/frameworks/kcoreaddons.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
    {name: "kdbusaddons", repo: "https://invent.kde.org/frameworks/kdbusaddons.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
    {name: "kdeclarative", repo: "https://invent.kde.org/frameworks/kdeclarative.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG],
        depends: [
            {name: "kconfig", repo: "https://invent.kde.org/frameworks/kconfig.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
            {name: "kglobalaccel", repo: "https://invent.kde.org/frameworks/kglobalaccel.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG],
                depends: [
                    {name: "kconfig", repo: "https://invent.kde.org/frameworks/kconfig.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
                    {name: "kwindowsystem", repo: "https://invent.kde.org/frameworks/kwindowsystem.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]},
                ]
            },
        ]
    },

];*/

console.log("WORKDIR: " + WORKDIR);
console.log("ABUILD_WRAPPER: " + ABUILD_WRAPPER);
console.log("ALPINE_APORTS_REPO: " + ALPINE_APORTS_REPO);

let buildStep = "";

(async () => {
    try {
        console.log("💤 Starting Plasma Mobile Nightly build at " + new Date().toLocaleString());
        exec("mkdir -pv " + WORKDIR);
        process.chdir(WORKDIR);

        // Clone aports repository from git, or pull if it already exists
        console.log("📦 Cloning aports repository");
        buildStep = "clone-aports";
        exec(`git -C aports pull || git clone ${ALPINE_APORTS_REPO} aports`);

        exec("mkdir -pv prolinux-nightly");
        exec("rm -rf prolinux-nightly/*"); // todo speed up build by removing pkg folders only

        console.log("📦 Package list: " + buildList);
        for (const pkg of buildList) {
            let fullList = parsePackageDependencies(pkg).filter((p) => repository.has(p));
            for (const d of fullList) {
                await buildPackage(repository.get(d)!);
            }
        }
        buildStep = `finish`;
    } catch (e) {
        console.error("❌ Build failed at step " + buildStep + ": " + e);
    }
})();

async function buildPackage(pkg: Package) {
    console.log("📦 -> Building " + pkg.name);
    // return if already built
    if (builtList.includes(pkg.name)) {
        console.log("📦 -> Already built, skipping");
        return;
    }

    // build dependencies first
    if (pkg.depends) {
        console.log("📦   -> Building dependencies: " + pkg.depends?.map((pkg) => pkg.name).join(", "));
        for (const dep of pkg.depends) {
            await buildPackage(dep);
        }
    }

    buildStep = `build-${pkg.name}-begin`;
    // clone the package repository
    const pkgDir = path.join(WORKDIR, "prolinux-nightly", pkg.name);
    const aportsPkgDir = path.join(WORKDIR, "aports", pkg.aports_repo, pkg.name);

    console.log("🔧   -> Clone package repository");
    buildStep = `build-${pkg.name}-clone`;
    exec(`mkdir -pv ${pkgDir}/src/${pkg.name}`);
    exec(`git -C ${pkgDir}/src/${pkg.name} pull || git clone ${pkg.repo} ${pkgDir}/src/${pkg.name}`);        

    buildStep = `build-${pkg.name}-pre-patch`;
    exec(`cp -v ${aportsPkgDir}/APKBUILD ${pkgDir}/APKBUILD`);
    const pkgVer = "9999_git" + (exec(`cd ${pkgDir}/src/${pkg.name} && git show -s --format=%ct`, false).toString().trim());
    console.log("🔧   -> Patching APKBUILD with pkgver " + pkgVer);
    buildStep = `build-${pkg.name}-patch`;
    exec(`sed -i '/pkgver=/c\pkgver=${pkgVer}' ${pkgDir}/APKBUILD`);
    exec(`sed -i 's/ $pkgname-lang//g' ${pkgDir}/APKBUILD`);
    /*if(pkg.patches) {
        for (const patch of pkg.patches) {
            console.log("🔧   -> Patching " + patch.file + " with " + patch.sedString);
            exec(`sed -i '${patch.sedString}' ${pkgDir}/${patch.file}`);
        }
    }*/

    // create link from pkgDir/src/${pkg.name} to pkgDir/src/${pkg.name}-${pkgVer}
    buildStep = `build-${pkg.name}-repolink`;
    exec(`ln -svf ${pkgDir}/src/${pkg.name} ${pkgDir}/src/${pkg.name}-${pkgVer}`);

    // build the package
    console.log("🔧   -> Building package");
    buildStep = `build-${pkg.name}-abuild`;
    // prepare, deps, build, rootpkg, index
    exec(`cd ${pkgDir} && abuild prepare`);
    exec(`cd ${pkgDir} && abuild deps`);
    exec(`cd ${pkgDir} && abuild build`);
    exec(`cd ${pkgDir} && abuild rootpkg`);
    exec(`cd ${pkgDir} && abuild index`);

    builtList.push(pkg.name);
}