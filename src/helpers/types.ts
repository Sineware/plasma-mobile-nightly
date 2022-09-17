export interface Patch {
    sedString: string;
    file: string;
}
export interface Package {
    name: string;
    repo: string;
    aports_repo: string;
    depends?: Package[];
    patches?: Patch[];
}
