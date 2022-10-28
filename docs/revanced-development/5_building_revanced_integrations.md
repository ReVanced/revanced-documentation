# Building the ReVanced Integrations

1. Make sure `$ANDROID_SDK_ROOT` or `$ANDROID_HOME` is set correctly

2. Clone the repository

   ```bash
   git clone https://github.com/revanced/revanced-integrations && cd revanced-integrations
   ```

3. Build the integrations

   ```bash
   ./gradlew build
   ```

The file will be located in `app/build/outputs/apk/release/app-release-unsigned.apk`

## Next step

[Building the ReVanced CLI](6_building_revanced_cli.md)
