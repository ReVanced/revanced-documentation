# 👨‍💻 Setup a development environment for ReVanced

A certain development environment is suggested to allow for streamlined development on ReVanced.

## 🚀 Get started

1. ⬇️ Clone repositories
    
    ```bash
    mkdir revanced && cd revanced
    
    repositories=(
        "revanced-cli"
        "revanced-patches"
        "revanced-patcher" # Only if you want to work on ReVanced Patcher
        "revanced-library" # Only if you want to work on ReVanced Library
        "revanced-integrations"
    )
    
    for repository in "${repositories[@]}" ; do
        git clone -b dev --single-branch --depth 1 https://github.com/revanced/$repository
    done
    ```

2. 🛠️ Build
    
    To build all projects, run the following command from the directory which contains the repositories.
    
    ```bash
    for project in */; do
        cd "$project" && ./gradlew build && cd ..
    done
    ```
    
> [!NOTE]
> If the build fails due to authentication, you may need to authenticate to GitHub Packages.
> Create a Github Personal Access Token with the scope `read:packages` [here](https://github.com/settings/tokens/new?scopes=read:packages&description=ReVanced) and add your token to ~/.gradle/gradle.properties. If gradle.properties does not exist, you can create it.
>
> Example `gradle.properties` file:
>
> ```properties
> gpr.user = <GitHub username>
> gpr.key = <Generated Personal Access Token>
> ```

## ⚙️ Setup your workspace in IntelliJ IDEA

1. Open the `revanced-cli` project in IntelliJ IDEA and ensure you are using the right JDK from [💼 Prerequisites](0_prerequisites.md)
2. Import other projects you cloned earlier as modules to the `revanced-cli` project

   - Open the `Project Structure` dialog by pressing `Ctrl + Alt + Shift + S`
   - Click on `Modules` and add the other projects as modules to the `revanced-cli` project

3. Add a new Run/Debug configuration for `revanced-cli`; Make sure to add `Before launch` tasks to build `revanced-patches` or `revanced-integrations` if necessary

   - Open the `Run/Debug Configurations` dialog by pressing `Alt + Shift + F10` and selecting `Edit Configurations...`
   - Add a new `Kotlin` configuration and configure it as follows:

     - `Main class`: `app.revanced.cli.command.MainCommandKt`
     - `Program arguments`: The program arguments you would use to run ReVanced CLI from the command line
       Example program arguments:

       ```sh
       patch
       -b revanced-patches\build\libs\revanced-patches-<version>.jar
       -m revanced-integrations\app\build\outputs\apk\release\revanced-integrations-<version>.apk
       binaries\some.apk
       -d
       ```

     - `Working directory`: The parent directory of the `revanced-cli` project (`$ProjectFileDir$/..`)
     - `Before launch`: Add a `Gradle` task to build `revanced-patches` (and `revanced-integrations` if necessary)

       - Click on the `+` button and select `Gradle`
       - Select the `revanced-patches` project and add the `build` task
       - Optionally, add the `revanced-integrations` project and the `build` task

       Ensure the `Build` task of the `revanced-cli` project is the last task in the list.

> [!WARNING]  
> With every release in the `revanced-patches` and `revanced-integrations` projects, the names of the artifacts change.
> **Do not forget to update them in the run configuration program arguments when you pull new commits.**

> [!TIP]  
> To test the `revanced-patcher` and `revanced-library` projects, publish them to your local Maven repository
> by running `./gradlew publishToMavenLocal`.  
> You can now use them as dependencies in local projects such as `revanced-patches` or `revanced-cli`.

## ⚠️ Troubleshoot your development environment

Confirm that your development environment works as intended:

- Debug the build configuration for `revanced-cli` and confirm that your IDE reaches and breaks at the breakpoint. Continue and let ReVanced CLI exit.

  - If the ReVanced CLI output is unexpected, confirm that you supplied the correct program arguments by following [💻 ReVanced CLI](/docs/revanced-cli).
  - If the breakpoint was not hit, confirm that you correctly added the necessary projects as modules to the `revanced-cli` project

## ❗ Afterword

A couple of things should be considered with the development environment for ReVanced:

- Follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
- If you intend to contribute to ReVanced, ensure that you branch off and PR to `dev` branches and follow the contribution guidelines of the respective repository
- Merge new commits regularly from the remotes to keep your branch up to date
- Keep your Run/Debug configuration up to date. After pulling new commits, ensure you use the correct paths in `Program arguments`. If you forget to do this, you might end up debugging for hours until realizing, you supply paths to old artifacts, because the artifact names change with new releases
