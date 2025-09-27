# Frequently asked questions

Please read them before asking questions that have been asked too many times.

## 1 Spotify does not work after patching

The issue is currently being looked into. See [this](https://revanced.app/announcements/14-spotify-login-fixed) and [this](https://revanced.app/announcements/15-spotify-dmca-notice-seeking-legal-help) for announcement for updates.

## 2 Is ReVanced available on iOS or TV?

ReVanced is a patcher for Android apps. Android is very different from iOS. Therefore, ReVanced is not available on iOS. The nearest equivalent to ReVanced on iOS is [Theos](https://theos.dev/). If your TV runs Android, it may be possible to use ReVanced.

## 3 How to get ReVanced?

ReVanced is a patcher for Android apps. Getting ReVanced means patching your app. Follow the [ReVanced Manager documentation](https://github.com/revanced/revanced-manager/tree/main/docs) to use ReVanced Manager or the [ReVanced CLI documentation](https://github.com/revanced/revanced-cli/tree/main/docs) to use ReVanced CLI.

## 4 Does ReVanced support non-rooted devices?

Yes! ReVanced supports non-root and rooted devices.

## 5 Which patches are available?

You can check the list of available patches at [revanced.app](https://revanced.app/patches), in [ReVanced Manager](https://github.com/revanced/revanced-manager/tree/main/docs) or [ReVanced CLI](https://github.com/revanced/revanced-cli/tree/main/docs). Since ReVanced is open source, anyone can pick up a feature. Your contributions are also very welcome. You can request patches [here](https://github.com/ReVanced/revanced-patches/issues/new?assignees=&labels=Feature+request&projects=&template=feature_request.yml&title=feat%3A+).

## 6 How can I help?

Since we are an open-source community and depend on outside help, you can always check out [our GitHub repositories](https://revanced.app/github) and contribute to ReVanced by creating an issue or pull request.

Additional, [financial donations](https://revanced.app/donate) are always welcomed.

## 7 Does ReVanced always stay up to date with X?

ReVanced Patcher allows you to use patches on any app version. However, please note that patches may not work if you're not using the versions suggested by ReVanced Manager.

## 8 What patches exist?

You can check supported apps and their patches on the [ReVanced Website](https://revanced.app/patches).

## 9 Where to get (full) APKs

You can get (full) APKs from sites such as [APKMirror](https://www.apkmirror.com/) or [APKPure](https://apkpure.net/de). An APK ends with the extension `.apk`.

If only split apks are available (`apkm` or `xapk` files), then tools like [AntiSplit M](https://github.com/AbdurazaaqMohammed/AntiSplit-M) can convert `apkm`/`xapk` of your device architecture to regular `apk` for use with ReVanced Manager.

## 10 Capture logs 

1. (Only if the setting exists) Turn on `Miscellaneous > Debugging > Debug logging` in the settings (Ensure you have included the `Enable debugging` patch).  
2. Install the [Android developer tools](https://developer.android.com/tools/releases/platform-tools) on a computer, open a command prompt, and capture the logs using the command `adb logcat | grep revanced:` or `adb logcat | grep AndroidRuntime` for app crash logs. to save the logs to a file use  `adb logcat | grep revanced > logs.txt` or `adb logcat | grep AndroidRuntime > logs.txt`
4. Alternatively, you can use any Android app capable of [capturing logs](https://play.google.com/store/apps/details?id=com.dp.logcatapp) (to use these apps a one time setup is required using a computer and ADB).
5. Alternatively, in YouTube you can copy the most recent logs directly from the Debug settings menu (due to clipboard limitations the log is limited to the most recent log data). No ADB or computer setup is required.

## 11 Can you help me?

You **must** include **all** relevant information regarding your issue in `#help` on our [Discord server](https://revanced.app/discord), or any platforms where you can ask for help (Find them on our [website](https://revanced.app)). This includes:

- The issues  
- Images, videos, and logs  
- Version of ReVanced Manager, the app you patch, etc.  
- How we can replicate the issue on our end

## 12 Where to get microG GmsCore?

If you patched your app with the `GmsCore support` patch, opening your app will redirect you automatically to the correct download page.

## 13 Is ReVanced affiliated with Vanced?

ReVanced is not affiliated with Vanced.

## 14 How to update patched apps?

To update a patched app, you need to patch and install the app again. 

Patch versions are completely different from the app version, and newer patches can exist even if the app version is the same as your currently patched app. See #3 in [Questions](questions.md).
