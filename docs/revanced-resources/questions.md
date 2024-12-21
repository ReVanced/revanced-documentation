# Frequently asked questions

Please read them before asking questions that have been asked too many times.

## 1 Is ReVanced available on iOS or TV?

ReVanced is a patcher for Android apps. Android is very different from iOS. Therefore, ReVanced is not available on iOS. The nearest equivalent to ReVanced on iOS is [Theos](https://theos.dev/). If your TV runs Android, it may be possible to use ReVanced.

## 2 How to get ReVanced?

ReVanced is a patcher for Android apps. Getting ReVanced means patching your app. Follow the [ReVanced Manager documentation](https://github.com/revanced/revanced-manager/tree/main/docs) to use ReVanced Manager or the [ReVanced CLI documentation](https://github.com/revanced/revanced-cli/tree/main/docs) to use ReVanced CLI.

## 3 Does ReVanced support non-rooted devices?

Yes! ReVanced supports non-root and rooted devices.

## 4 Which patches are available?

You can check the list of available patches at [revanced.app](https://revanced.app/patches), in [ReVanced Manager](https://github.com/revanced/revanced-manager/tree/main/docs) or [ReVanced CLI](https://github.com/revanced/revanced-cli/tree/main/docs). Since ReVanced is open source, anyone can pick up a feature. Your contributions are also very welcome. You can request patches [here](https://github.com/ReVanced/revanced-patches/issues/new?assignees=&labels=Feature+request&projects=&template=feature_request.yml&title=feat%3A+).

## 5 How can I help?

Since we are an open-source community and depend on outside help, you can always check out [our GitHub repositories](https://revanced.app/github) and contribute to ReVanced by creating an issue or pull request.

## 6 Does ReVanced always stay up to date with X?

ReVanced Patcher allows you to use patches on any app version. However, please note that patches may not work if you're not using the versions suggested by ReVanced Manager.

## 7 What patches exist?

You can check supported apps and their patches on the [ReVanced Website](https://revanced.app/patches).

## 8 Where to get (full) APKs

You can get (full) APKs from sites such as [APKMirror](https://www.apkmirror.com/) or [APKPure](https://apkpure.net/de). An APK ends with the extension `.apk`.

## 9 Capture logs 

1. (Only if the setting exists) Turn on `Misc > Debugging > Debug logging` in the settings (Ensure you have used the `Enable debugging` patch).  
2. Open a shell over ADB and capture logs using the command `logcat | grep revanced:` (or `logcat | grep AndroidRuntime` for exception logs). Alternatively, any app capable of capturing logs using Logcat can be used.

## 10 Can you help me?

You **must** include **all** relevant information regarding your issue in `#help` on our [Discord server](https://revanced.app/discord), or any platforms where you can ask for help (Find them on our [website](https://revanced.app)). This includes:

- The issues  
- Images, videos, and logs  
- Version of ReVanced Manager, the app you patch, etc.  
- How we can replicate the issue on our end

## 11 Where to get MicroG GmsCore?

If you patched YouTube with the `GmsCore support` patch, opening YouTube will redirect you automatically to the correct download page.

## 12 Is ReVanced affiliated with Vanced?

ReVanced is not affiliated with Vanced.

## 13 How to update patched apps?

To update a patched app, you need to patch and install the new version of the app. See #3 in [Questions](questions.md).
