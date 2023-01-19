import {Package, Patch} from "../helpers/types";
const PATCH_PLASMA_WORKSPACE_REMOVE_0001PATCH: Patch = {cmd: 'truncate -s 0 ./prolinux-nightly/plasma-workspace/src/0001-widgetexplorer-Dont-recurse-into-applets-containments.patch'};
const PATCH_KWAYLAND_REMOVE_0001PATCH: Patch = {cmd: 'truncate -s 0 ./prolinux-nightly/kwayland/src/0001-PlasmaWindowManagement-Avoid-unbounded-recursion-and-delay-in-readData.patch'};
const PATCH_KIMAGEFORMATS_REMOVE_0001PATCH: Patch = {cmd: 'truncate -s 0 ./prolinux-nightly/kimageformats/src/0001-avif-revert-previous-commit.patch'}
const PATCH_KWIN_REMOVE_0001PATCH: Patch = {cmd: 'truncate -s 0 ./prolinux-nightly/kwin/src/0001-Revert-autotests-Make-mapping-between-KWin-Output-an.patch'}

const PATCH_REPLACE_QT5_WITH_QT6: Patch = {cmd: 'sed -i "s/qt5/qt6/g" ./APKBUILD', runInDir: true};

export const globalPatches = [
    PATCH_REPLACE_QT5_WITH_QT6,
];

// List of packages and their git repositories
export const repository = new Map<string,Package>([
    // other
    ["plasma-wayland-protocols", { name: "plasma-wayland-protocols", repo: "https://invent.kde.org/libraries/plasma-wayland-protocols.git", aports_repo: "community"}],

    // plasma
    ["bluedevil", { name: "bluedevil", repo: "https://invent.kde.org/plasma/bluedevil.git", aports_repo: "community", extraDepends: ["kcmutils-dev", "kdoctools-dev"]}],
    ["breeze", { name: "breeze", repo: "https://invent.kde.org/plasma/breeze.git", aports_repo: "community", extraDepends: ["kcmutils-dev"]}],
    ["breeze-grub", { name: "breeze-grub", repo: "https://invent.kde.org/plasma/breeze-grub.git", aports_repo: "community"}],
    ["breeze-gtk", { name: "breeze-gtk", repo: "https://invent.kde.org/plasma/breeze-gtk.git", aports_repo: "community"}],
    ["breeze-plymouth", { name: "breeze-plymouth", repo: "https://invent.kde.org/plasma/breeze-plymouth.git", aports_repo: "community"}],
    ["discover", { name: "discover", repo: "https://invent.kde.org/plasma/discover.git", aports_repo: "community", extraDepends: ["purpose-dev"], skipBuild: true}], // todo: alpine patches broken
    ["drkonqi", { name: "drkonqi", repo: "https://invent.kde.org/plasma/drkonqi.git", aports_repo: "community", extraDepends: ["kuserfeedback-dev"]}],
    ["kactivitymanagerd", { name: "kactivitymanagerd", repo: "https://invent.kde.org/plasma/kactivitymanagerd.git", aports_repo: "community"}],
    ["kde-cli-tools", { name: "kde-cli-tools", repo: "https://invent.kde.org/plasma/kde-cli-tools.git", aports_repo: "community"}],
    ["kde-gtk-config", { name: "kde-gtk-config", repo: "https://invent.kde.org/plasma/kde-gtk-config.git", aports_repo: "community"}],
    ["kdecoration", { name: "kdecoration", repo: "https://invent.kde.org/plasma/kdecoration.git", aports_repo: "community"}],
    ["kdeplasma-addons", { name: "kdeplasma-addons", repo: "https://invent.kde.org/plasma/kdeplasma-addons.git", aports_repo: "community"}],
    ["kgamma5", { name: "kgamma5", repo: "https://invent.kde.org/plasma/kgamma5.git", aports_repo: "community"}],
    ["khotkeys", { name: "khotkeys", repo: "https://invent.kde.org/plasma/khotkeys.git", aports_repo: "community"}],
    ["kinfocenter", { name: "kinfocenter", repo: "https://invent.kde.org/plasma/kinfocenter.git", aports_repo: "community"}],
    ["kmenuedit", { name: "kmenuedit", repo: "https://invent.kde.org/plasma/kmenuedit.git", aports_repo: "community"}],
    ["kscreen", { name: "kscreen", repo: "https://invent.kde.org/plasma/kscreen.git", aports_repo: "community", extraDepends: ["layer-shell-qt-dev"]}],
    ["kscreenlocker", { name: "kscreenlocker", repo: "https://invent.kde.org/plasma/kscreenlocker.git", aports_repo: "community", extraDepends: ["libkscreen-dev"]}],
    ["ksshaskpass", { name: "ksshaskpass", repo: "https://invent.kde.org/plasma/ksshaskpass.git", aports_repo: "community"}],
    ["kwallet-pam", { name: "kwallet-pam", repo: "https://invent.kde.org/plasma/kwallet-pam.git", aports_repo: "community"}],
    ["kwayland-integration", { name: "kwayland-integration", repo: "https://invent.kde.org/plasma/kwayland-integration.git", aports_repo: "community"}],
    ["kwayland", { name: "kwayland", repo: "https://invent.kde.org/frameworks/kwayland.git", aports_repo: "community", patches: [PATCH_KWAYLAND_REMOVE_0001PATCH]}],
    ["kwin", { name: "kwin", repo: "https://invent.kde.org/plasma/kwin.git", aports_repo: "community", patches: [PATCH_KWIN_REMOVE_0001PATCH]}],
    ["kwrited", { name: "kwrited", repo: "https://invent.kde.org/plasma/kwrited.git", aports_repo: "community"}],
    ["layer-shell-qt", { name: "layer-shell-qt", repo: "https://invent.kde.org/plasma/layer-shell-qt.git", aports_repo: "community"}],
    ["libkscreen", { name: "libkscreen", repo: "https://invent.kde.org/plasma/libkscreen.git", aports_repo: "community", extraDepends: ["kconfig-dev"]}],
    ["libksysguard", { name: "libksysguard", repo: "https://invent.kde.org/plasma/libksysguard.git", aports_repo: "community"}],
    ["milou", { name: "milou", repo: "https://invent.kde.org/plasma/milou.git", aports_repo: "community"}],
    ["oxygen", { name: "oxygen", repo: "https://invent.kde.org/plasma/oxygen.git", aports_repo: "community"}],
    ["plasma-browser-integration", { name: "plasma-browser-integration", repo: "https://invent.kde.org/plasma/plasma-browser-integration.git", aports_repo: "community"}],
    ["plasma-desktop", { name: "plasma-desktop", repo: "https://invent.kde.org/plasma/plasma-desktop.git", aports_repo: "community"}],
    ["plasma-disks", { name: "plasma-disks", repo: "https://invent.kde.org/plasma/plasma-disks.git", aports_repo: "community"}],
    ["plasma-firewall", { name: "plasma-firewall", repo: "https://invent.kde.org/plasma/plasma-firewall.git", aports_repo: "community"}],
    ["plasma-integration", { name: "plasma-integration", repo: "https://invent.kde.org/plasma/plasma-integration.git", aports_repo: "community"}],
    ["plasma-mobile", { name: "plasma-mobile", repo: "https://invent.kde.org/plasma/plasma-mobile.git", aports_repo: "community", extraDepends: ["kirigami-addons-dev"]}],
    ["plasma-nano", { name: "plasma-nano", repo: "https://invent.kde.org/plasma/plasma-nano.git", aports_repo: "community"}],
    ["plasma-nm", { name: "plasma-nm", repo: "https://invent.kde.org/plasma/plasma-nm.git", aports_repo: "community", extraDepends: ["kcmutils-dev", "kdeclarative-dev"]}],
    ["plasma-pa", { name: "plasma-pa", repo: "https://invent.kde.org/plasma/plasma-pa.git", aports_repo: "community", skipBuild: true}],
    ["plasma-sdk", { name: "plasma-sdk", repo: "https://invent.kde.org/plasma/plasma-sdk.git", aports_repo: "community"}],
    ["plasma-systemmonitor", { name: "plasma-systemmonitor", repo: "https://invent.kde.org/plasma/plasma-systemmonitor.git", aports_repo: "community"}],
    ["plasma-thunderbolt", { name: "plasma-thunderbolt", repo: "https://invent.kde.org/plasma/plasma-thunderbolt.git", aports_repo: "community"}],
    ["plasma-vault", { name: "plasma-vault", repo: "https://invent.kde.org/plasma/plasma-vault.git", aports_repo: "community"}],
    ["plasma-workspace", { name: "plasma-workspace", repo: "https://invent.kde.org/plasma/plasma-workspace.git", aports_repo: "community", patches: [PATCH_PLASMA_WORKSPACE_REMOVE_0001PATCH]}],
    ["plasma-workspace-wallpapers", { name: "plasma-workspace-wallpapers", repo: "https://invent.kde.org/plasma/plasma-workspace-wallpapers.git", aports_repo: "community"}],
    ["plymouth-kcm", { name: "plymouth-kcm", repo: "https://invent.kde.org/plasma/plymouth-kcm.git", aports_repo: "community", extraDepends: ["kcmutils-dev"]}],
    ["polkit-kde-agent-1", { name: "polkit-kde-agent-1", repo: "https://invent.kde.org/plasma/polkit-kde-agent-1.git", aports_repo: "community"}],
    ["powerdevil", { name: "powerdevil", repo: "https://invent.kde.org/plasma/powerdevil.git", aports_repo: "community"}],
    ["qqc2-breeze-style", { name: "qqc2-breeze-style", repo: "https://invent.kde.org/plasma/qqc2-breeze-style.git", aports_repo: "community"}],
    ["sddm-kcm", { name: "sddm-kcm", repo: "https://invent.kde.org/plasma/sddm-kcm.git", aports_repo: "community"}],
    ["systemsettings", { name: "systemsettings", repo: "https://invent.kde.org/plasma/systemsettings.git", aports_repo: "community"}],
    ["xdg-desktop-portal-kde", { name: "xdg-desktop-portal-kde", repo: "https://invent.kde.org/plasma/xdg-desktop-portal-kde.git", aports_repo: "community"}],
    
    // frameworks
    ["attica", { name: "attica", repo: "https://invent.kde.org/frameworks/attica.git", aports_repo: "community"}],
    ["baloo", { name: "baloo", repo: "https://invent.kde.org/frameworks/baloo.git", aports_repo: "community"}],
    ["bluez-qt", { name: "bluez-qt", repo: "https://invent.kde.org/frameworks/bluez-qt.git", aports_repo: "community"}],
    ["breeze-icons", { name: "breeze-icons", repo: "https://invent.kde.org/frameworks/breeze-icons.git", aports_repo: "community"}],
    ["extra-cmake-modules", { name: "extra-cmake-modules", repo: "https://invent.kde.org/frameworks/extra-cmake-modules.git", aports_repo: "community"}],
    ["frameworkintegration", { name: "frameworkintegration", repo: "https://invent.kde.org/frameworks/frameworkintegration.git", aports_repo: "community"}],
    ["kactivities", { name: "kactivities", repo: "https://invent.kde.org/frameworks/kactivities.git", aports_repo: "community"}],
    ["kactivities-stats", { name: "kactivities-stats", repo: "https://invent.kde.org/frameworks/kactivities-stats.git", aports_repo: "community"}],
    ["kapidox", { name: "kapidox", repo: "https://invent.kde.org/frameworks/kapidox.git", aports_repo: "community"}],
    ["karchive", { name: "karchive", repo: "https://invent.kde.org/frameworks/karchive.git", aports_repo: "community"}],
    ["kauth", { name: "kauth", repo: "https://invent.kde.org/frameworks/kauth.git", aports_repo: "community"}],
    ["kbookmarks", { name: "kbookmarks", repo: "https://invent.kde.org/frameworks/kbookmarks.git", aports_repo: "community"}],
    ["kcalendarcore", { name: "kcalendarcore", repo: "https://invent.kde.org/frameworks/kcalendarcore.git", aports_repo: "community"}],
    ["kcmutils", { name: "kcmutils", repo: "https://invent.kde.org/frameworks/kcmutils.git", aports_repo: "community"}],
    ["kcodecs", { name: "kcodecs", repo: "https://invent.kde.org/frameworks/kcodecs.git", aports_repo: "community"}],
    ["kcompletion", { name: "kcompletion", repo: "https://invent.kde.org/frameworks/kcompletion.git", aports_repo: "community"}],
    ["kconfig", { name: "kconfig", repo: "https://invent.kde.org/frameworks/kconfig.git", aports_repo: "community"}],
    ["kconfigwidgets", { name: "kconfigwidgets", repo: "https://invent.kde.org/frameworks/kconfigwidgets.git", aports_repo: "community", extraDepends: ["kguiaddons"]}],
    ["kcontacts", { name: "kcontacts", repo: "https://invent.kde.org/frameworks/kcontacts.git", aports_repo: "community"}],
    ["kcoreaddons", { name: "kcoreaddons", repo: "https://invent.kde.org/frameworks/kcoreaddons.git", aports_repo: "community"}],
    ["kcrash", { name: "kcrash", repo: "https://invent.kde.org/frameworks/kcrash.git", aports_repo: "community"}],
    ["kdav", { name: "kdav", repo: "https://invent.kde.org/frameworks/kdav.git", aports_repo: "community"}],
    ["kdbusaddons", { name: "kdbusaddons", repo: "https://invent.kde.org/frameworks/kdbusaddons.git", aports_repo: "community"}],
    ["kdeclarative", { name: "kdeclarative", repo: "https://invent.kde.org/frameworks/kdeclarative.git", aports_repo: "community", skipBuild: false}],
    ["kded", { name: "kded", repo: "https://invent.kde.org/frameworks/kded.git", aports_repo: "community"}],
    ["kdelibs4support", { name: "kdelibs4support", repo: "https://invent.kde.org/frameworks/kdelibs4support.git", aports_repo: "community"}],
    ["kdesignerplugin", { name: "kdesignerplugin", repo: "https://invent.kde.org/frameworks/kdesignerplugin.git", aports_repo: "community"}],
    ["kdesu", { name: "kdesu", repo: "https://invent.kde.org/frameworks/kdesu.git", aports_repo: "community", extraDepends: ["plasma-workspace-dev"], skipBuild: true}], // failing because apkindex references old packages
    ["kdnssd", { name: "kdnssd", repo: "https://invent.kde.org/frameworks/kdnssd.git", aports_repo: "community"}],
    ["kdoctools", { name: "kdoctools", repo: "https://invent.kde.org/frameworks/kdoctools.git", aports_repo: "community"}],
    ["kemoticons", { name: "kemoticons", repo: "https://invent.kde.org/frameworks/kemoticons.git", aports_repo: "community"}],
    ["kfilemetadata", { name: "kfilemetadata", repo: "https://invent.kde.org/frameworks/kfilemetadata.git", aports_repo: "community"}],
    ["kglobalaccel", { name: "kglobalaccel", repo: "https://invent.kde.org/frameworks/kglobalaccel.git", aports_repo: "community"}],
    ["kguiaddons", { name: "kguiaddons", repo: "https://invent.kde.org/frameworks/kguiaddons.git", aports_repo: "community"}],
    ["kholidays", { name: "kholidays", repo: "https://invent.kde.org/frameworks/kholidays.git", aports_repo: "community"}],
    ["khtml", { name: "khtml", repo: "https://invent.kde.org/frameworks/khtml.git", aports_repo: "community"}],
    ["ki18n", { name: "ki18n", repo: "https://invent.kde.org/frameworks/ki18n.git", aports_repo: "community"}],
    ["kiconthemes", { name: "kiconthemes", repo: "https://invent.kde.org/frameworks/kiconthemes.git", aports_repo: "community"}],
    ["kidletime", { name: "kidletime", repo: "https://invent.kde.org/frameworks/kidletime.git", aports_repo: "community", extraDepends: ["plasma-wayland-protocols", "wayland-protocols"]}],
    ["kimageformats", { name: "kimageformats", repo: "https://invent.kde.org/frameworks/kimageformats.git", aports_repo: "community", patches: [PATCH_KIMAGEFORMATS_REMOVE_0001PATCH]}],
    ["kinit", { name: "kinit", repo: "https://invent.kde.org/frameworks/kinit.git", aports_repo: "community"}],
    ["kio", { name: "kio", repo: "https://invent.kde.org/frameworks/kio.git", aports_repo: "community", dontDistcc: true}],
    ["kirigami2", { name: "kirigami2", repo: "https://invent.kde.org/frameworks/kirigami.git", aports_repo: "community"}],
    ["kitemmodels", { name: "kitemmodels", repo: "https://invent.kde.org/frameworks/kitemmodels.git", aports_repo: "community"}],
    ["kitemviews", { name: "kitemviews", repo: "https://invent.kde.org/frameworks/kitemviews.git", aports_repo: "community"}],
    ["kjobwidgets", { name: "kjobwidgets", repo: "https://invent.kde.org/frameworks/kjobwidgets.git", aports_repo: "community"}],
    ["kjs", { name: "kjs", repo: "https://invent.kde.org/frameworks/kjs.git", aports_repo: "community"}],
    ["kjsembed", { name: "kjsembed", repo: "https://invent.kde.org/frameworks/kjsembed.git", aports_repo: "community"}],
    ["kmediaplayer", { name: "kmediaplayer", repo: "https://invent.kde.org/frameworks/kmediaplayer.git", aports_repo: "community"}],
    ["knewstuff", { name: "knewstuff", repo: "https://invent.kde.org/frameworks/knewstuff.git", aports_repo: "community"}],
    ["knotifications", { name: "knotifications", repo: "https://invent.kde.org/frameworks/knotifications.git", aports_repo: "community"}],
    ["knotifyconfig", { name: "knotifyconfig", repo: "https://invent.kde.org/frameworks/knotifyconfig.git", aports_repo: "community"}],
    ["kpackage", { name: "kpackage", repo: "https://invent.kde.org/frameworks/kpackage.git", aports_repo: "community"}],
    ["kparts", { name: "kparts", repo: "https://invent.kde.org/frameworks/kparts.git", aports_repo: "community"}],
    ["kpeople", { name: "kpeople", repo: "https://invent.kde.org/frameworks/kpeople.git", aports_repo: "community"}],
    ["kplotting", { name: "kplotting", repo: "https://invent.kde.org/frameworks/kplotting.git", aports_repo: "community"}],
    ["kpty", { name: "kpty", repo: "https://invent.kde.org/frameworks/kpty.git", aports_repo: "community"}],
    ["kquickcharts", { name: "kquickcharts", repo: "https://invent.kde.org/frameworks/kquickcharts.git", aports_repo: "community"}],
    ["kross", { name: "kross", repo: "https://invent.kde.org/frameworks/kross.git", aports_repo: "community"}],
    ["krunner", { name: "krunner", repo: "https://invent.kde.org/frameworks/krunner.git", aports_repo: "community"}],
    ["kservice", { name: "kservice", repo: "https://invent.kde.org/frameworks/kservice.git", aports_repo: "community"}],
    ["ktexteditor", { name: "ktexteditor", repo: "https://invent.kde.org/frameworks/ktexteditor.git", aports_repo: "community"}],
    ["ktextwidgets", { name: "ktextwidgets", repo: "https://invent.kde.org/frameworks/ktextwidgets.git", aports_repo: "community"}],
    ["kunitconversion", { name: "kunitconversion", repo: "https://invent.kde.org/frameworks/kunitconversion.git", aports_repo: "community"}],
    ["kwallet", { name: "kwallet", repo: "https://invent.kde.org/frameworks/kwallet.git", aports_repo: "community"}],
    ["kwidgetsaddons", { name: "kwidgetsaddons", repo: "https://invent.kde.org/frameworks/kwidgetsaddons.git", aports_repo: "community"}],
    ["kwindowsystem", { name: "kwindowsystem", repo: "https://invent.kde.org/frameworks/kwindowsystem.git", aports_repo: "community"}],
    ["kxmlgui", { name: "kxmlgui", repo: "https://invent.kde.org/frameworks/kxmlgui.git", aports_repo: "community"}],
    ["kxmlrpcclient", { name: "kxmlrpcclient", repo: "https://invent.kde.org/frameworks/kxmlrpcclient.git", aports_repo: "community"}],
    ["modemmanager-qt", { name: "modemmanager-qt", repo: "https://invent.kde.org/frameworks/modemmanager-qt.git", aports_repo: "community"}],
    ["networkmanager-qt", { name: "networkmanager-qt", repo: "https://invent.kde.org/frameworks/networkmanager-qt.git", aports_repo: "community"}],
    ["oxygen-icons", { name: "oxygen-icons", repo: "https://invent.kde.org/frameworks/oxygen-icons5.git", aports_repo: "community", skipBuild: true}],
    ["plasma-framework", { name: "plasma-framework", repo: "https://invent.kde.org/frameworks/plasma-framework.git", aports_repo: "community"}],
    ["prison", { name: "prison", repo: "https://invent.kde.org/frameworks/prison.git", aports_repo: "community"}],
    ["purpose", { name: "purpose", repo: "https://invent.kde.org/frameworks/purpose.git", aports_repo: "community"}],
    ["qqc2-desktop-style", { name: "qqc2-desktop-style", repo: "https://invent.kde.org/frameworks/qqc2-desktop-style.git", aports_repo: "community"}],
    ["solid", { name: "solid", repo: "https://invent.kde.org/frameworks/solid.git", aports_repo: "community"}],
    ["sonnet", { name: "sonnet", repo: "https://invent.kde.org/frameworks/sonnet.git", aports_repo: "community"}],
    ["syndication", { name: "syndication", repo: "https://invent.kde.org/frameworks/syndication.git", aports_repo: "community"}],
    ["syntax-highlighting", { name: "syntax-highlighting", repo: "https://invent.kde.org/frameworks/syntax-highlighting.git", aports_repo: "community"}],
    ["threadweaver", { name: "threadweaver", repo: "https://invent.kde.org/frameworks/threadweaver.git", aports_repo: "community"}],
    
    // plasma mobile gear
    ["alligator", { name: "alligator", repo: "https://invent.kde.org/plasma-mobile/alligator.git", aports_repo: "community"}],
    ["angelfish", { name: "angelfish", repo: "https://invent.kde.org/plasma-mobile/angelfish.git", aports_repo: "community", skipBuild: true, extraDepends: ["kirigami-addons-dev"]}],
    ["audiotube", { name: "audiotube", repo: "https://invent.kde.org/plasma-mobile/audiotube.git", aports_repo: "community"}],
    ["calindori", { name: "calindori", repo: "https://invent.kde.org/plasma-mobile/calindori.git", aports_repo: "community"}],
    ["kalk", { name: "kalk", repo: "https://invent.kde.org/plasma-mobile/kalk.git", aports_repo: "community"}],
    ["kasts", { name: "kasts", repo: "https://invent.kde.org/plasma-mobile/kasts.git", aports_repo: "community", extraDepends: ["kirigami-addons-dev"]}],
    ["kclock", { name: "kclock", repo: "https://invent.kde.org/plasma-mobile/kclock.git", aports_repo: "community", extraDepends: ["kirigami-addons-dev"]}],
    ["keysmith", { name: "keysmith", repo: "https://invent.kde.org/utilities/keysmith.git", aports_repo: "community"}],
    ["khealthcertificate", { name: "khealthcertificate", repo: "https://invent.kde.org/pim/khealthcertificate.git", aports_repo: "community", extraDepends: ["ki18n-dev"]}],
    ["kirigami-addons", { name: "kirigami-addons", repo: "https://invent.kde.org/libraries/kirigami-addons.git", aports_repo: "community"}],
    ["koko", { name: "koko", repo: "https://invent.kde.org/graphics/koko.git", aports_repo: "community", skipBuild: true}],
    ["kongress", { name: "kongress", repo: "https://invent.kde.org/utilities/kongress.git", aports_repo: "community"}],
    ["krecorder", { name: "krecorder", repo: "https://invent.kde.org/plasma-mobile/krecorder.git", aports_repo: "community", extraDepends: ["kirigami-addons-dev"]}],
    ["ktrip", { name: "ktrip", repo: "https://invent.kde.org/utilities/ktrip.git", aports_repo: "community"}],
    ["kweather", { name: "kweather", repo: "https://invent.kde.org/plasma-mobile/kweather.git", aports_repo: "community"}],
    ["kweathercore", { name: "kweathercore", repo: "https://invent.kde.org/libraries/kweathercore.git", aports_repo: "community"}],
    ["neochat", { name: "neochat", repo: "https://invent.kde.org/network/neochat.git", aports_repo: "community", extraDepends: ["kirigami-addons-dev"]}],
    ["plasma-dialer", { name: "plasma-dialer", repo: "https://invent.kde.org/plasma-mobile/plasma-dialer.git", aports_repo: "community", extraDepends: ["kio-dev", "kirigami-addons-dev"]}],
    ["plasma-phonebook", { name: "plasma-phonebook", repo: "https://invent.kde.org/plasma-mobile/plasma-phonebook.git", aports_repo: "community", extraDepends: ["kirigami-addons-dev"]}],
    ["plasma-settings", { name: "plasma-settings", repo: "https://invent.kde.org/plasma-mobile/plasma-settings.git", aports_repo: "community", extraDepends: ["kirigami-addons-dev"]}],
    ["plasmatube", { name: "plasmatube", repo: "https://invent.kde.org/plasma-mobile/plasmatube.git", aports_repo: "community", extraDepends: ["mpv", "mpv-dev"]}],
    ["qmlkonsole", { name: "qmlkonsole", repo: "https://invent.kde.org/plasma-mobile/qmlkonsole.git", aports_repo: "community", extraDepends: ["kirigami-addons-dev"]}],
    ["spacebar", { name: "spacebar", repo: "https://invent.kde.org/plasma-mobile/spacebar.git", aports_repo: "community", extraDepends: ["c-ares"], skipBuild: true}],
    ["tokodon", { name: "tokodon", repo: "https://invent.kde.org/network/tokodon.git", aports_repo: "community", extraDepends: ["kirigami-addons-dev", "kio-dev"]}],
    ["vakzination", { name: "vakzination", repo: "https://invent.kde.org/plasma-mobile/vakzination.git", aports_repo: "community"}],
]);
