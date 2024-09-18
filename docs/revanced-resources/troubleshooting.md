# Troubleshooting

This is a collection of common errors and fixes.

## 15 No internet connection

This issue can be caused by changing your Google account password. Re-login into GmsCore or reinstall it.

## 16 How to use the ReVanced Manager

Follow the [official](https://github.com/revanced/revanced-manager/tree/main/docs) guide to learn how to use ReVanced Manager.

## 17 YouTube is crashing on startup or redirecting me to a page after applying patches

You might likely be patching a split APK file, so refer to `9`, or you might be missing [MicroG GmsCore](https://github.com/revanced/GmsCore/releases/latest). Install it. Otherwise, refer to `11` as well as `16`.

## 18 Watch history isn't being saved on YouTube

- If you use a regular YouTube account instead, whitelist `s.youtube.com` in your system ad-blocker if you have one.
- Otherwise refer to [this](https://www.reddit.com/r/revancedapp/comments/1fk5dph/spoofing_fixes_for_youtube/) Reddit post.

## 19 The player UI on YouTube doesn't go away

This issue occurs randomly. Currently, the only fix is to restart the app.

## 20 The shorts button in YouTube is gone

Disable `General layout > Navigation button > Hide shorts button`.

## 21 ReVanced Manager is crashing/not working

ReVanced Manager is still work in progress. Before submitting an issue, make sure it is not a duplicate of an existing issue.

## 22 Google login does not work

Please use username/password to login.

## 23 Links don't open in a patched app

Follow [this](https://support.google.com/pixelphone/answer/6271667). The process may vary for your device. You may need to disable or uninstall the unpatched app that occupies the links to set them for the patched app.

## 24 `org.schabi.newpipe` is not installed

Please install NewPipe [here](https://newpipe.net/#download).

## 27 Installation is blocked due to conflicting with an existing installation

This implies that you must remove the previous installation to solve the conflict.

## 28 SponsorBlock does not work

The servers of SponsorBlock are likely having issues right now. Review the [current status](https://status.sponsor.ajay.app/) of SponsorBlock.

## 29 YouTube playback speed menu entry missing

This was a side-effect of the `Spoof client` patch, which was already fixed in a later release of ReVanced Patches. Patch YouTube with the latest version of ReVanced Patches.

## 30 YouTube player swipe gestures not working

This is currently a side-effect of the `Spoof client` patch. The issue is tracked [here](https://github.com/ReVanced/revanced-patches/issues/3208).

## 31 YouTube live streams playing in low resolution

This is currently a side-effect of the `Spoof client` patch. The issue is tracked [here](https://github.com/ReVanced/revanced-patches/issues/3208).

## 32 YouTube video not playing

If the video is instantly paused when you press the play button, you must disable Picture in Picture due to an issue with your OS/YouTube. If playback stops and buffers infinitely, see [this](https://www.reddit.com/r/revancedapp/comments/1cwvda7/youtube_playback_issue_fixed) Reddit post.

## 33 Common issues during or after patching

You may have toggled settings in ReVanced Manager that are not recommended to change. Please review the warnings that appear when adjusting these settings and reset them to their default configuration.

## 34 No ReVanced logo after patching YouTube

By default, the patch to change the logo of the YouTube app is not applied. Use the `Custom branding` patch to change the logo.

## 35 YouTube Shorts still not hidden

To hide YouTube shorts, use the `Hide Shorts components` and `Navigation buttons` patches. In the YouTube settings, enable:

- `Shorts > Hide Shorts in feed`
- `General layout > Navigation buttons > Hide Shorts button`
