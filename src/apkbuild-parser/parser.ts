import path from "path";
import fs from "fs";
import exec from "../helpers/exec";
import {repository} from "./repo";

let pkgList: Set<string> = new Set();
export function parsePackageDependancies(packageName: string): string[] {
    if(pkgList.has(packageName)) { 
        //console.log("  -> Already added.")
        return [];
    }
    console.log("Parsing dependancies for " + packageName);
    try {
        let apkbuildPath = "./workdir/aports/community/" + packageName + "/APKBUILD";
        if(!fs.existsSync(apkbuildPath)) {
            apkbuildPath = "./workdir/aports/main/" + packageName + "/APKBUILD";
            if(!fs.existsSync(apkbuildPath)) {
                console.log("  -> Package not found.");
                return [];
            }
        }
        let dependencies = exec(path.join(__dirname, "apkbuild-wrapper.sh") + " " + apkbuildPath, false).toString().split(" ");
        pkgList.add(packageName.trim());

        for(let pkg of dependencies) {
            pkg = pkg.trim();
            if(pkg.endsWith("-dev")) {
                pkg = pkg.slice(0, -4);
            }
            parsePackageDependancies(pkg).forEach(item => pkgList.add(item))
            pkgList.add(pkg);
        }
        return Array.from(pkgList);
    } catch(e: any) {
        //console.error("Failed to parse dependancies for " + packageName + ": ");
        //console.error(e);
        return [];
    }
    
    
}

const depends = parsePackageDependancies("plasma-mobile").filter(item => repository.has(item));
console.log(depends);