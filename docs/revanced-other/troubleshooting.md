# **Troubleshooting**

This is a collection of common errors and fixes.

## No internet connection

Re-login into GmsCore or reinstall it.

## How to use the ReVanced Manager

Follow the [official](https://github.com/revanced/revanced-manager/tree/main/docs) guide to learn how to use ReVanced Manager.

## YouTube is crashing on startup or redirecting me to a page after applying patches

You might likely be patching a split APK file or missing. Refer to [this](questions.md#where-to-get-full-apks) question. Or you might be missing [GmsCore](https://github.com/ReVanced/GmsCore/releases/latest). Install it.

## Watch history isn't being saved on YouTube

Whitelist `s.youtube.com` in your ad-blocker or refer to [this](https://discord.com/channels/952946952348270622/954833032114733086/1213562098244788275) announcement.

## The player UI on YouTube doesn't go away

This issue occurs randomly. Currently, the only fix is to restart the app.

## The shorts button in YouTube is gone

Disable `General layout > Navigation button > Hide shorts button`.

## ReVanced Manager is crashing/not working

ReVanced Manager is still a work in progress. Before submitting an issue, make sure it is not a duplicate of an existing issue.

## Google login does not work on

Please use username/password to login.

## Links don't open in a patched app

Follow [this](https://support.google.com/pixelphone/answer/6271667). The process may vary for your device. You may need to disable or uninstall the unpatched app that occupies the links to set them for the patched app.

## `org.schabi.newpipe` is not installed

Please install NewPipe from [here](https://newpipe.net/#download).

## Videos do not play or rewind

Please refer to [this](https://discordapp.com/channels/952946952348270622/954833032114733086/1085179089708654652) announcement.

## Installation is blocked due to conflicting with an existing installation

This implies that you must remove the previous installation to solve the conflict.

## SponsorBlock does not work

The servers of SponsorBlock are likely having issues right now. Review the [current status](https://status.sponsor.ajay.app/) of SponsorBlock.

## Endscreen cards are missing/Ambient mode does not work

This is a side effect caused by a recent workaround for [this](#links-dont-open-in-a-patched-app) issue. Please refer to https://github.com/revanced/revanced-patches/issues/1752.

## Seekbar preview missing in YouTube

A recent patch causes this. You can find it in [this](https://discord.com/channels/952946952348270622/954833032114733086/1121235521801310229) announcement. Currently, your only option is to disable the patch in the settings. This may cause playback issues.

## Playback stops

Check [this](https://discord.com/channels/952946952348270622/954833032114733086/1121235521801310229) announcement.

## Common issues during or after patching

You may have toggled settings in ReVanced Manager that are not recommended to change. Please review the warnings that appear when adjusting these settings and reset them to their default configuration.

## No ReVanced logo after patching YouTube

By default, the patch to change the logo of the YouTube app is not applied. Use the `Custom branding` patch to change the logo.

## YouTube Shorts still not hidden

To hide YouTube shorts, use the Hide Shorts components and Navigation buttons patches. In the YouTube settings, enable:
- `Shorts > Hide Shorts in feed`
- `General layout> Navigation buttons > Hide Shorts button`
