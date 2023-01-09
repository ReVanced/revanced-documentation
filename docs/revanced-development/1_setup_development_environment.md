# 👨‍💻 Setup a development environment for ReVanced

A certain development environment is suggested to allow for streamlined development on ReVanced.

## 1. ⬇️ Clone necessary repositories

```bash
repositories=(
    "revanced-cli"
    "revanced-patches"
    "revanced-patcher" # optional
    "revanced-integrations"
)

for repository in "${repositories[@]}" ; do
        git clone -b dev --single-branch --depth 1 https://github.com/revanced/$repository
done
```

## 2. 🛠️ Build from source

### Before building you need to be authenticated to GitHub Packages. This will assume you have a GitHub account

Create a PAT with the scope `read:packages` [here](https://github.com/settings/tokens/new?scopes=read:packages&description=Revanced) and add your token to `~/.gradle/gradle.properties`.

Example `gradle.properties` file:

```properties
gpr.user = ReVanced
gpr.key = ghp_key
```

### To build all projects, run the following command from the directory which contains the repositories

```bash
repositories=(
    "revanced-cli"
    "revanced-patches"
    "revanced-patcher" # optional
    "revanced-integrations"
)

for repository in "${repositories[@]}" ; do
        cd $repository
        ./gradlew build
        cd ..
done
```

## 3. ⚙️ Setup IntelliJ IDEA

1. Open the `revanced-cli` project in IntelliJ IDEA and ensure you are using the right JDK from [💼 Prerequisites](0_prerequisites.md)
2. Import the `revanced-patches` and optionally the `revanced-patcher` project as modules into the `revanced-cli` project
3. Add a new Run/Debug configuration for the `revanced-cli` project

   Example configuration:

   ```xml
    <component name="ProjectRunConfigurationManager">
    <configuration default="false" name="Run ReVanced CLI" type="JetRunConfigurationType">
        <option name="MAIN_CLASS_NAME" value="app.revanced.cli.main.MainKt" />
        <module name="revanced-cli.main" />
        <option name="PROGRAM_PARAMETERS" value="
            --options ../options.toml
            -o ../revanced.apk
            -a ../binaries/unpatched-input.apk
            -t ../revanced-cache
            -b ../revanced-patches\build\libs\revanced-patches-<version>.jar
            -m ../revanced-integrations\app\build\outputs\apk\release\revanced-integrations-<version>.apk
            -d device-name"
        />
        <shortenClasspath name="NONE" />
        <method v="2">
        <option name="RunConfigurationTask" enabled="true" run_configuration_name="revanced-patcher [publish]" run_configuration_type="GradleRunConfiguration" />
        <option name="RunConfigurationTask" enabled="true" run_configuration_name="revanced-patches [build]" run_configuration_type="GradleRunConfiguration" />
        <option name="Make" enabled="true" />
        </method>
    </configuration>
    </component>
   ```

   > **Note**: The builds of the `revanced-patches` and `revanced-integrations` change. **Do not forget to update them as well in the run configuration program arguments.**

## 5. ⚙️ Setup Android Studio

1. Open the `revanced-integrations` project in Android Studio and ensure you are using the latest Android SDK.
2. Add a new default build configuration and confirm if it succeeds.

## 6. ⚠️ Troubleshoot your development environment

To confirm your development environment works as intended, set a breakpoint in any patch in IntelliJ IDEA. Run the configuration and confirm, that your IDE reaches and breaks at the breakpoint. Continue and let the ReVanced CLI exit.

- If the ReVanced CLI output is unexpected, confirm if you supplied the correct program arguments by following [💻 ReVanced CLI](./docs/revanced-development).

- If the breakpoint was not hit, confirm, that you correctly added the necessary projects as modules to the `revanced-cli` project

## ❗ Afterword

Couple things should be considered with the development environment for ReVanced:

- Follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)

- Pull new commits from remote to keep your branch up to date

- Keep your Run/Debug configuration up to date. Make sure, you use the correct paths in your program argument after you pull new commits. If you forget to do this, you might end up debugging for hours until realising, you supply the wrong paths to the ReVanced CLI

- Use development branches and always branch off and PR to `dev` branches

- To use the local `revanced-patcher` project in the `revanced-cli` and `revanced-patches` projects, make sure you publish it to the local Maven repository with `./gradlew publish` and use the correct version in the `build.gradle.kts` file in the `revanced-cli` and `revanced-patches` projects, otherwise, it will use the package from GitHub Packages
