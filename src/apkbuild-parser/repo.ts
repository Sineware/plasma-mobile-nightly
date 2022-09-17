import {Package, Patch} from "../helpers/types";

const PATCH_REMOVE_LANG: Patch = {sedString: '/subpackages=/c\subpackages="$pkgname-dev $pkgname-doc"', file: "APKBUILD"};

// List of packages and their git repositories
export const repository = new Map<string,Package>([
    ["plasma-mobile", {name: "plasma-mobile", repo: "https://invent.kde.org/plasma/plasma-mobile", aports_repo: "community"}],
    ["kactivities", { name: "kactivities", repo: "https://invent.kde.org/frameworks/kactivities.git", aports_repo: "community"}],
    ["kconfig", {name: "kconfig", repo: "https://invent.kde.org/frameworks/kconfig.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]}],
    ["kcoreaddons", {name: "kcoreaddons", repo: "https://invent.kde.org/frameworks/kcoreaddons.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]}],
    ["kwindowsystem", {name: "kwindowsystem", repo: "https://invent.kde.org/frameworks/kwindowsystem.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]}],
    ["kauth", { name: "kauth", repo: "https://invent.kde.org/frameworks/kauth.git", aports_repo: "community" }],
    ["kbookmarks", {name: "kbookmarks", repo: "https://invent.kde.org/frameworks/kbookmarks.git", aports_repo: "community"}],
    ["kcodecs", {name: "kcodecs", repo: "https://invent.kde.org/frameworks/kcodecs.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]}],
    ["kconfigwidgets", {name: "kconfigwidgets", repo: "https://invent.kde.org/frameworks/kconfigwidgets.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]}],
    ["kcompletion", {name: "kcompletion", repo: "https://invent.kde.org/frameworks/kcompletion.git", aports_repo: "community"}],
    ["kwidgetsaddons", {name: "kwidgetsaddons", repo: "https://invent.kde.org/frameworks/kwidgetsaddons.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]}],
    ["kcoreaddons", {name: "kcoreaddons", repo: "https://invent.kde.org/frameworks/kcoreaddons.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]}],
    ["kdbusaddons", {name: "kdbusaddons", repo: "https://invent.kde.org/frameworks/kdbusaddons.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]}],
    ["kdeclarative", {name: "kdeclarative", repo: "https://invent.kde.org/frameworks/kdeclarative.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]}],
    ["kglobalaccel", {name: "kglobalaccel", repo: "https://invent.kde.org/frameworks/kglobalaccel.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]}],
    ["kwindowsystem", {name: "kwindowsystem", repo: "https://invent.kde.org/frameworks/kwindowsystem.git", aports_repo: "community", patches: [PATCH_REMOVE_LANG]}],
]);