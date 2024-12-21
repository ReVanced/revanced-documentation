# Troubleshooting

This is a collection of common errors and fixes.

## 14 No internet connection

This issue can be caused by changing your Google account password. Re-login into GmsCore or reinstall it.

## 15 How to use the ReVanced Manager

Follow the [official](https://github.com/revanced/revanced-manager/tree/main/docs) guide to learn how to use ReVanced Manager.

## 16 YouTube is crashing on startup or redirecting me to a page after applying patches

You might likely be patching a split APK file, so refer to `8`, or you might be missing [MicroG GmsCore](https://github.com/revanced/GmsCore/releases/latest). Install it. Otherwise, refer to `10` as well as `15`.

## 17 Watch history isn't being saved on YouTube

- If you use a regular YouTube account instead, whitelist `s.youtube.com` in your system ad-blocker if you have one.
- Otherwise refer to [this](https://www.reddit.com/r/revancedapp/comments/1fk5dph/spoofing_fixes_for_youtube/) Reddit post.

## 18 The player UI on YouTube doesn't go away

This issue occurs randomly. Currently, the only fix is to restart the app.

## 19 The shorts button on YouTube is gone

Disable `General layout > Navigation button > Hide shorts button`.

## 20 ReVanced Manager is crashing/not working

ReVanced Manager is still a work in progress. Before submitting an issue, ensure it is not duplicating an existing issue.

## 21 Google login does not work

Use a username/password to log in.

## 22 Links don't open in a patched app

Follow [this](https://support.google.com/pixelphone/answer/6271667). The process may vary for your device. You may need to disable or uninstall the unpatched app that occupies the links to set them for the patched app.

## 23 `org.schabi.newpipe` is not installed

Please install NewPipe [here](https://newpipe.net/#download).

## 24 Installation is blocked due to conflicting with an existing installation

This implies that you must remove the previous installation to solve the conflict.

## 25 SponsorBlock does not work

The servers of SponsorBlock are likely having issues right now. Review the [current status](https://status.sponsor.ajay.app/) of SponsorBlock.

## 26 YouTube or YouTube Music playback not working

If playback stops and buffers infinitely, or you get an error when trying to play it, see [this](https://www.reddit.com/r/revancedapp/comments/1fk5dph/spoofing_fixes_for_youtube/) Reddit post.
For YouTube Music, see [this](https://www.reddit.com/r/revancedapp/comments/1hfr6ne/youtube_music_playback_issues_fixed/) Reddit post.

If videos on YouTube are instantly paused when you press the play button, you must disable Picture-in-Picture due to an issue with your OS/YouTube.

## 27 Common issues during or after patching

You may have toggled settings in ReVanced Manager that are not recommended to change. Please review the warnings when adjusting these settings and reset them to their default configuration.

## 28 No ReVanced logo after patching YouTube

By default, the patch to change the logo of the YouTube app is not applied. Use the `Custom branding` patch to change the logo.

## 29 YouTube Shorts still not hidden

Use the `Hide Shorts components` and `Navigation buttons` patches to hide YouTube shorts. In the YouTube settings, enable:

- `Shorts > Hide Shorts in feed`
- `General layout > Navigation buttons > Hide Shorts button`
