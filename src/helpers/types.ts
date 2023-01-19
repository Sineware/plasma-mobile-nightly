export interface Patch {
    cmd: string;
    postCmd?: string;
    runInDir?: true;
}
export interface Package {
    name: string;
    repo: string;
    aports_repo: string;
    patches?: Patch[];
    extraDepends?: string[];
    skipBuild?: boolean;
    dontDistcc?: boolean;
}
