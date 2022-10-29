# ReVanced Manager Guide [Non-root]

This is a guide to use ReVanced Manager for non-root. Refer to the [root guide](nop.com) for rooted devices.

## Setting up

### Requirements

- Android 8+
- ARM64 device

### Installation

- [Download the latest Manager APK here](https://github.com/revanced/revanced-manager/releases/latest)
- [Where can I download an APK for patching?](https://idk.lol)

## Using ReVanced Manager

### How do I patch?

1. Tap the `Patcher` tab in the bottom navbar.
2. Tap the `Select an application` section.
3. Here, you have the option to choose between selecting an app from on-device or selecting an APK directly from storage.
   - For selecting on-device applications, tap on the desired app from the shown menu. For an app to show up in this list, the app must be already installed on the device.
   - To select from storage, click on the `Storage` button and select the APK normally through the file picker. **`.apks` and `.apkm` files are supported**.
   - Verify that the selected application is a version supported by ReVanced. [See the full list of supported versions of all apps here.](https://github.com/revanced/revanced-patches#-patches)
4. After selecting an application, you will be brought back to the main patcher. Tap the `Select patches` section.
5. Select your desired patches. Note that certain patches are required for non-root installations (e.g. MicroG support patch for YouTube).
6. Tap `Done`.
7. The app is now patching. This process can range from 2-10 minutes depending on your device. Refrain from closing the Manager.
8. When patching is complete, tap on the `Install` button. You may also tap on the three dots menu in the top right to share the APK or share logs.

### How do I manage patched applications?
1. Tap on the `Dashboard` tab in the bottom navbar.
2. Select the `Installed` chip.
3. You will see a list of all apps patched by the Manager. Tap on the `Info` for the application you want to manage.

Here, you will be greeted with buttons to open, uninstall, or re-patch the application. You will also see information regarding the app, such as when it was patched, the type of installation, and the selected patches.

### How do I update Manager?
There are two ways of updating the Manager:

1. In the `Dashboard` page, there is an updates section. Tap on the `Update Manager` button when an update is available.
2. Head to the Manager's [GitHub releases](https://github.com/revanced/revanced-manager/releases/latest) to manually download and install the latest APK.
