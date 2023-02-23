# plasma-mobile-nightly
Nightly Alpine packages for Plasma Mobile from master/main and postmarketOS images.

[The Images build script can be found here.](https://github.com/Sineware/plasma-mobile-nightly-img)

### Environment Variables (optional)
- BUILD_SINGLE_PACKAGE = string: (build a single package from repo.ts)
- BUILD_SINGLE_PACKAGE_BRANCH = string: (select a branch from the git repo)
- BUILD_SINGLE_PACKAGE_REPO = string: (set a alternative repo url)
- PACKAGE_LIST = string,string,string...: (build the list of packages)
- IGNORE_GIT_SILENT = true/false: (build packages even if the last commit was GIT_SILENT)
- DISTCC_SETTINGS = true/false: (build packages using distcc env)

### Running
Make sure to have run `sudo apk add alpine-sdk ccache` (to have a compiler), `sudo addgroup user abuild` (to be able to run abuild), and `abuild-keygen -a -i` (to generate a key for signing a package). Relog to update groups.

It can be convenient to have passwordless sudo enabled.

Start the script: `npm run build`

### Example Command: Building plasma-mobile only with a specific branch
```sh
BUILD_SINGLE_PACKAGE=plasma-mobile BUILD_SINGLE_PACKAGE_BRANCH=work/kwintaskswitcher npm run build
```