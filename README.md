
<h1 align="center">
   <img alt="ReVanced logo" width="64px" src="https://user-images.githubusercontent.com/47723802/200201657-ff3bf4c8-277d-4b27-8913-24cfa1559cb3.png"/>
    <br/>
   ReVanced Manager
</h1>

Official documentation of ReVanced Manager.

For bug reports, suggestions, or feature requests, open an issue [here](https://github.com/revanced/revanced-manager/issues/new/choose). If you wish to discuss the Manager further, a thread has been made under the [#development](https://discord.com/channels/952946952348270622/1002922226443632761) channel in our [Discord server](revanced.app/discord).

>**Note**: ReVanced Manager is in **Alpha**. There's a big chance that the Manager might not work at all for you. 

## Index
* [Setting up](https://wip.com)
* [Using ReVanced Manager](https://wip.com)
   * [How to patch](https://wip.com)
   * [Managing patched applications](https://wip.com)
   * [Updating ReVanced Manager](https://wip.com)
* [Building from source](https://wip.com)

## Setting up
### Requirements
- Android 8+
- ARM64 device

### Installation
- [Download the latest Manager APK here](https://github.com/revanced/revanced-manager/releases/latest)
- Where can I download an APK for patching?
    - You can get a full apk from mirroring sites such as [APKMirror](https://apkmirror.com). In the example of YouTube, you would want to download the full apk from APKMirror [here](https://www.apkmirror.com/apk/google-inc/youtube/youtube-17-41-37-release/youtube-17-41-37-2-android-apk-download/) until ReVanced introduces support for apk bundles (`.apkm`) or split apk (`.apks`) files.

## Using ReVanced Manager
### How to patch
1. Tap the `Patcher` tab in the bottom navbar.
2. Tap the `Select an application` section.
3. Here, you have the option to choose between selecting an app from on-device or selecting an APK directly from storage.
   - For selecting on-device applications, tap on the desired app from the shown menu. For an app to show up in this list, the app must be already installed on the device. **This feature is incomplete for non-root users as ReVanced has not implemented split APK support. We suggest you pick your APK from storage for now.**
   - To select from storage, click on the `Storage` button and select the APK normally through the file picker. **`.apks` and `.apkm` files are not supported at this time**.
   - Verify that the selected application is a version supported by ReVanced. [See the full list of supported versions of all apps here.](https://github.com/revanced/revanced-patches#-patches)
4. After selecting an application, you will be brought back to the main patcher screen. Tap the `Select patches` section.
5. Select your desired patches. Note that certain patches are required for non-root installations (e.g. MicroG support patch for YouTube).
6. Tap `Done`.
7. The app is now patching. This process can range from 2-10 minutes depending on your device. Refrain from closing the Manager.
8. When patching is complete, tap on the `Install` button. You may also tap on the three dots menu in the top right to share the APK or share logs. Note that when you close the Manager, the patched APK file will be **deleted from your device**.

### Managing patched applications
1. Tap on the `Dashboard` tab in the bottom navbar.
2. Select the `Installed` chip.
3. You will see a list of all apps patched by the Manager. Tap on the `Info` for the application you want to manage.

Here, you will be greeted with buttons to open, uninstall, or re-patch the application. You will also see information regarding the app, such as when it was patched, the type of installation, and the selected patches.

### Updating ReVanced Manager
There are two ways of updating the Manager:

1. In the `Dashboard` page, there is an updates section. Tap on the `Update Manager` button when an update is available.
2. Head to the Manager's [GitHub releases](https://github.com/revanced/revanced-manager/releases/latest) to manually download and install the latest APK.


## Building from source
1. Set up the Flutter environment for your [platform](https://docs.flutter.dev/get-started/install).
2. Clone `https://github.com/revanced/revanced-manager.git`.
3. Add your github token in gradle.properties like [this](https://github.com/revanced/revanced-documentation/wiki/Building-from-source).
4. Open the project in terminal.
5. Run `flutter pub get` in terminal.
6. Then run `flutter packages pub run build_runner build --delete-conflicting-outputs` (Must be done on each git pull).
7. Build the release apk by running `flutter build apk`.
