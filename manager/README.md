
<h1 align="center">
   💊 
   <br/>
   ReVanced Manager
</h1>

Official documentation of ReVanced Manager.

For bug reports, suggestions, or feature requests, open an issue [here](https://github.com/revanced/revanced-manager/issues/new/choose). If you wish to discuss the Manager further, a thread has been made under the [#development](https://discord.com/channels/952946952348270622/1002922226443632761) channel in our [Discord server](https://revanced.app/discord).

> **Note**: ReVanced Manager is in **alpha**. There's a big chance that the Manager may not work at all for you. 

## Table of contents
* [Using ReVanced Manager](#using-revanced-manager)
   * [Table of contents](#table-of-contents)
   * [Setting up](#setting-up)
       * [Requirements](#requirements)
       * [Installation](#installation)
   * [Patching applications](#patching-applications)
   * [Managing patched applications](#managing-patched-applications)
   * [Updating ReVanced Manager](#updating-revanced-manager)
* [Troubleshooting](#troubleshooting)
* [Building from source](#building-from-source)


## Using ReVanced Manager
### Setting up
#### Requirements
- Android 8+
- ARM64 device

#### Installation
- Download ReVanced Manager from [here](https://github.com/revanced/revanced-manager/releases/latest)
    
### Patching applications
- Tap the **Patcher** button in the bottom navigation bar
- Tap the **Select an application** card
- Here, you have the option to choose between selecting an app from on-device or selecting an APK file directly from storage.
   * For selecting on-device applications, tap on the desired app from the shown menu. For an app to show up in this list, the app must be already installed on the device.
     > **Warning**: This feature is incomplete and may cause issues while patching. We suggest you pick your APK from storage for now.
   * To select from storage, click on the **Storage** button and select the APK normally through the file picker.
     > **Note**: We recommend downloading APK files from APKMirror as a temporary solution. Though, `apkm` and `apks` files are not supported at the moment.
   * Verify that the selected application is a version supported by ReVanced. See the full list of supported versions of all apps [here](https://github.com/revanced/revanced-patches#-patches).
- After selecting an application, you will be brought back to the **Patcher** screen again. Tap the **Select patches** card.
- Select your desired patches. Note that certain patches are required for non-root installations. *(e.g. **MicroG Support** patch for YouTube)*
- Tap the **Done** button and the **Patch** button.
- The app is now patching. This process can range from 2-10 minutes depending on your device. Refrain from closing or force-stopping the Manager.
- When patching is complete, tap on the **Install** button. You may also tap on the three vertical dots in the top right of your screen to share the APK, share logs, or export your APK.

   > **Warning**: If you close the Manager after patching, the patched APK file will be **automatically deleted from your device**!

### Managing patched applications
- Tap on the **Dashboard** tab in the bottom navigation bar
- Select the **Installed** chip
- You will see a list of all apps patched by the Manager. Tap on the **Info** button for the application you want to manage

   > **Note**: You may also want to see an app that has updates available. For that, click the **Updates available** chip instead.

Here, you will be greeted with buttons to open, uninstall, or repatch *(update)* the application. You will also see information regarding the app, such as when it was patched, the type of installation, and the selected patches.

### Updating ReVanced Manager
There are two ways of updating the Manager.

- In the **Dashboard** page, there is an **Updates** section. You'll be able to tap on the **Update Manager** button when an update is available.
- Head to the [Manager's GitHub releases](https://github.com/revanced/revanced-manager/releases/latest) to manually download and install the latest installation file.


## Troubleshooting
...


## Building from source
- Setup the Flutter environment for your [platform](https://docs.flutter.dev/get-started/install).
- Clone the repository
```sh
git clone https://github.com/revanced/revanced-manager.git
```
- Add your GitHub acesss token in `gradle.properties` like [so](https://github.com/revanced/revanced-documentation/wiki/Building-from-source).
- Open a terminal in the workspace directory
- Run this to download packages
```sh
flutter pub get
```
- Then this, it must be run on each time you sync your local repository with the remote's.
```sh
flutter packages pub run build_runner build --delete-conflicting-outputs
```
- Then you can build the application using
```sh
flutter build apk
```
