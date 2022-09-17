import path from "path";
import fs from "fs";
import exec from "../helpers/exec";
import {repository} from "./repo";

let pkgList: Set<string> = new Set();

export function parsePackageDependencies(packageName: string): string[] {
    if (pkgList.has(packageName)) {
        return [];
    }
    pkgList.add(packageName.trim());
    console.log('Parsing dependencies for ${packageName}');
    
    try {
        let apkbuildPath = "./workdir/aports/community/" + packageName + "/APKBUILD";
        
        if (!fs.existsSync(apkbuildPath)) {
            apkbuildPath = "./workdir/aports/main/" + packageName + "/APKBUILD";
            if (!fs.existsSync(apkbuildPath)) {
                console.log("  -> Package not found.");
                return [];
            }
        }
        let dependencies = exec(path.join(__dirname, "apkbuild-wrapper.sh") + " " + apkbuildPath, false).toString().split(" ");
        let packageList = [] as []string;
        
        // add dependencies first
        for(let pkg of dependencies) {
            pkg = pkg.trim();
            if(pkg.endsWith("-dev")) {
                pkg = pkg.slice(0, -4);
            }
            parsePackageDependencies(pkg).forEach(item => packageList.push(item))
        }
        
        // add current package
        packageList.push(packageName.trim());
        return packageList;
    } catch(e: any) {
        //console.error("Failed to parse dependancies for " + packageName + ": ");
        //console.error(e);
        return [];
    }
}

const depends = parsePackageDependencies("plasma-mobile").filter(item => repository.has(item));
console.log(depends);
