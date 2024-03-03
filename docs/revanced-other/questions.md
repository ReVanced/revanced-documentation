# **Frequently Asked Questions**

## How to get ReVanced?

You can follow [ReVanced Manager documentation](https://github.com/revanced/revanced-manager/tree/main/docs) to use ReVanced Manager. Alternatively, you can follow [ReVanced CLI documentation](https://github.com/revanced/revanced-cli/tree/main/docs) to use ReVanced CLI.

## Does ReVanced support non-rooted devices?

Yes! ReVanced supports non-root and rooted devices.

## Does or will ReVanced have feature X?

You can check the list of available patches at [revanced.app](https://revanced.app/patches), in [ReVanced Manager](https://github.com/revanced/revanced-manager/tree/main/docs) or [ReVanced CLI](https://github.com/revanced/revanced-cli/tree/main/docs). Since ReVanced is open source, anyone can pick up a feature. Your contributions are also very welcome.

## How can I help?

Since we are an open-source community and depend on outside help, you can always check out our GitHub repositories and contribute to ReVanced by creating an issue or pull request.

## Does ReVanced always stay up to date with X?

ReVanced Patcher allows you to patch any app version. However, patches may not work if you're not using the versions suggested by ReVanced Manager.

## What patches exist?

You can check supported apps and their patches on the [ReVanced Website](https://revanced.app/patches).

## Where to get (full) APKs

You can get (full) APKs from sites such as [APKMirror](https://www.apkmirror.com) or [APKPure](https://apkpure.net). An APK ends with the extension `.apk`.

## Capture logs from patched YouTube

1. Turn on `Misc > Debugging > Debug logging` (Make sure you have applied the `Enable debugging` patch)
2. Open a shell over ADB and capture logs using the command `logcat | grep revanced:` (or `logcat | grep AndroidRuntime` for exception logs). Alternatively, any app capable of capturing logs using Logcat can be used

## Can you help me?

Include all relevant information regarding your issue in [#⁠🆘・support](https://discord.com/channels/952946952348270622/1135563848586379264). Mention the issues, how they occurred, how we can reproduce them, your environment, versions of the tools you used, images and recordings, logs, and your attempts to fix them.

## What is GmsCore and where to download Vanced MicroG?

GmsCore and Vanced MicroG are free implementations of Google Play Services necessary to run patched Google apps such as YouTube. Vanced MicroG can be obtained from [here](https://github.com/TeamVanced/VancedMicroG/releases/latest).

## Is ReVanced affiliated with Vanced?

No! ReVanced is not affiliated with Vanced.

## How to update patched apps?

To update a patched app, you need to patch the new version of the app.
