export interface Patch {
    cmd: string;
    postCmd?: string;
}
export interface Package {
    name: string;
    repo: string;
    aports_repo: string;
    patches?: Patch[];
    extraDepends?: string[];
}
