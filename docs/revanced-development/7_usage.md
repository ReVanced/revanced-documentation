# Using the ReVanced CLI

1. Make sure your device is connected

   ```bash
   adb shell exit
   ```

2. If you plan to use the root variant, check if you have root access

   ```bash
   adb shell su -c exit
   ```

3. Copy the ADB device name

   ```bash
   adb devices
   ```

4. Run the CLI

   ```bash
   # Non-Root
   java -jar revanced-cli-all.jar \
   -a input.apk \
   -c \
   -d device-name \
   -o output.apk \
   -b revanced-patches.jar

   # Root
   # In the case of YouTube you want to exlude the patch 'microg-support' with the option '-e'. The option '-e' allows you to exclude patches (e.g. -e microg-support -e amoled ...)
   java -jar revanced-cli-all.jar \
   -a input.apk \
   -c \
   -d device-name \
   -o output.apk \
   -b revanced-patches.jar \
   -e microg-support \
   --mount
   ```

> :warning: A lot of patches require the integrations which you can merge by adding the `-m` flag and passing the `integrations` file as the argument.
> If you need the list of patches available, pass in `-l`.

If you specified an ADB device the application should now open on your device and the CLI will show logs until the app is closed.
