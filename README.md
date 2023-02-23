# plasma-mobile-nightly
Nightly Alpine packages for Plasma Mobile from master/main and postmarketOS images.

[The Images build script can be found here.](https://github.com/Sineware/plasma-mobile-nightly-img)

### Environment Variables
- BUILD_SINGLE_PACKAGE = string: (build a single package from repo.ts)
- BUILD_SINGLE_PACKAGE_BRANCH = string: (select a branch from the git repo)
- BUILD_SINGLE_PACKAGE_REPO = string: (set a alternative repo url)
- PACKAGE_LIST = string,string,string...: (build the list of packages)
- IGNORE_GIT_SILENT = true/false: (build packages even if the last commit was GIT_SILENT)
- DISTCC_SETTINGS = true/false: (build packages using distcc env)