# Using the ReVanced CLI

1. Make sure your device is connected

   ```bash
   adb shell exit
   ```

   If you plan to use the root variant, check if you have root access

      ```bash
      adb shell su -c exit
      ```

2. Copy the ADB device name

   ```bash
   adb devices
   ```

3. Run the CLI

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

> **Note**: Patches might require additional integrations to be merged. Merge integrations with the option `-m`. 
> **Note**: You can list all patches available by using the option `-l`.

If you specified an ADB device the patched application will be automatically installed.
