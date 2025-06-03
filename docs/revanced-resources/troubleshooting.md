# Troubleshooting

This is a collection of common errors and fixes.

## 4 YouTube Audio track menu is missing

Change to iOS TV in `Settings > ReVanced > Miscellaneous > Spoof video streams`

You must also be logged in and not in incognito mode, otherwise the audio track menu is still hidden even if iOS TV is selected.

## 5 Videos play with dubbed AI audio translations

Change spoofing to iOS TV (item `4`), then enable `Force original audio language` in the `Video` settings.

## 7 Stable volume is not available

Stable volume is not available when using Spoof video streams.

## 8 Childrens/music videos do not play and an error is shown

A YouTube account is required to play most childrens videos.  Ensure you are logged into a YouTube account and you have not enabled incognito mode.

## 15 App shows "No internet connection"

This issue can be caused by recently changing your Google account password. Re-login into MicroG GmsCore, or uninstall then reinstall MicroG.

## 16 How to use the ReVanced Manager

Follow the [official](https://github.com/revanced/revanced-manager/tree/main/docs) guide to learn how to use ReVanced Manager.

## 17 YouTube is crashing on startup or redirecting me to a page after applying patches

You might be missing [MicroG GmsCore](https://github.com/revanced/GmsCore/releases/latest). Install it.  Or you might be patching a split APK file (refer to `16`).

## 18 YouTube Watch history is not being saved

If you use a system ad-blocker, then whitelist `s.youtube.com`.  Otherwise check your YouTube/Google account permissions and ensure your account watch history is enabled.

## 19 The player UI on YouTube does not go away

This issue occurs randomly. Currently, the only fix is to restart the app.

## 20 The Shorts tab button on YouTube is gone

Disable `General > Navigation buttons > Hide Shorts button`.

## 21 ReVanced Manager is crashing/not working

ReVanced Manager is still a work in progress. Before submitting an issue, ensure it is not duplicating an existing issue.

## 22 Google login does not work

Use a username/password to log in. Some devices may require temporarily turning off 2 factor authentication.

## 23 Links don't open in a patched app

Follow [this](https://support.google.com/pixelphone/answer/6271667). The process may vary for your device. You may need to disable or uninstall the unpatched app that occupies the links to set them for the patched app.

## 24 `org.schabi.newpipe` is not installed

Please install NewPipe [here](https://newpipe.net/#download).

## 27 Installation is blocked due to conflicting with an existing installation

This implies that you must remove the previous installation to solve the conflict.  If patching YouTube and your device is not rooted then ensure `GmsCore support` was included during patching.

## 28 SponsorBlock does not work

The servers of SponsorBlock are likely having issues right now. Review the [current status](https://status.sponsor.ajay.app/) of SponsorBlock.

## 32 YouTube or YouTube Music playback not working

If playback stops and buffers infinitely, or you get an error when trying to play it, see [this](https://www.reddit.com/r/revancedapp/comments/1fk5dph/spoofing_fixes_for_youtube/) Reddit post.
For YouTube Music, see [this](https://www.reddit.com/r/revancedapp/comments/1hfr6ne/youtube_music_playback_issues_fixed/) Reddit post.

If videos on YouTube are instantly paused when you press the play button, you must disable Picture in Picture due to an issue with your OS/YouTube.

## 33 Common issues during or after patching

You may have toggled settings in ReVanced Manager that are not recommended to change. Please review the warnings when adjusting these settings and reset them to their default configuration.

## 34 No ReVanced logo after patching YouTube

By default, the patch to change the logo of the YouTube app is not applied. Use the `Custom branding` patch to change the logo.

## 35 YouTube Shorts still not hidden

Use the `Hide Shorts components` and `Navigation buttons` patches to hide YouTube shorts. In the YouTube ReVanced settings, enable:

- `Shorts > Hide Shorts in feed`
- `General > Navigation buttons > Hide Shorts button`



