# 👨‍💻 Setup a development environment for ReVanced

A certain development environment is suggested to allow for streamlined development on ReVanced.

## 🚀 Get started

1. **Clone repositories**

    ```bash
    mkdir revanced && cd revanced
    
    repositories=(
        "revanced-cli"
        "revanced-patches"
        "revanced-patcher" # Only if you want to work on ReVanced Patcher
        "revanced-library" # Only if you want to work on ReVanced Library
    )
    
    for repository in "${repositories[@]}" ; do
        git clone -b dev --single-branch --depth 1 https://github.com/revanced/$repository
    done
    ```

2. **Build**

    Ensure, that all projects build successfully. Run the following command in the `revanced` directory:

    ```bash
    for project in */; do
        cd "$project" && ./gradlew build && cd ..
    done
    ```

> [!NOTE]
> If the build fails due to authentication, you may need to authenticate to GitHub Packages.
> Create a personal access tokens with the scope `read:packages` [here](https://github.com/settings/tokens/new?scopes=read:packages&description=ReVanced) and add your token to ~/.gradle/gradle.properties. Create the file if it does not exist.
>
> Example `gradle.properties` file:
>
> ```properties
> gpr.user = <GitHub username>
> gpr.key = <Personal access token>
> ```

## ⚙️ Setting up your workspace in IntelliJ IDEA

Follow these steps to configure your development environment for the `revanced-cli` project in IntelliJ IDEA:

1. **Open the `revanced-cli` project**:

   - Open the `revanced-cli` project in IntelliJ IDEA
   - Ensure you are using the correct JDK as specified in [💼 Prerequisites](0_prerequisites.md)

2. **Import projects**:

   Import the projects you cloned as modules into the `revanced-cli` project:

   1. Open the **Project Structure** dialog by pressing **Ctrl + Alt + Shift + S**
   2. Navigate to the **Modules** section
   3. Import each additional project as a module under the `revanced-cli` project

3. **Synchronize Gradle projects**:

   - Click on the **Sync All Gradle Projects** button in the Gradle tool window
   - Verify that all Gradle projects are imported successfully without errors

4. **Configure the Run Configuration for `revanced-cli`**:

   1. Locate the `app.revanced.cli.command.MainCommandKt` class in the `revanced-cli` project
   2. Click the green **Play** button next to the `main` function. This will generate a new run configuration
   3. Edit the run configuration as follows:

      - **Program arguments**: Specify the arguments you would use to run ReVanced CLI from the command line. Example:

        ```sh
        patch
        -p revanced-patches\patches\build\libs\patches-<version>.rvp
        binaries\some.apk
        -i # Install the patched APK to a device connected via ADB after patching
        ```

      - **Working directory**: Set to the parent directory of the `revanced-cli` project:

        ```sh
        $ProjectFileDir$/..
        ```

      - **Before launch**: Add a Gradle task to build `revanced-patches:patches`:

        1. Click the **+** button and select **Run Gradle Task**
        2. Choose the `revanced-patches:patches` project and add the `build` task

> [!WARNING]
> The RVP file names in `revanced-patches` change with each release.  
> **Ensure you update the path to the patches in the run configuration program arguments whenever you pull new commits.**

### 🥼 Working on `revanced-patcher` and `revanced-library` (Optional)

1. **Import as modules**: Import `revanced-patcher` and `revanced-library` as modules in the `revanced-cli` project

2. **Update versions**:

   - In their respective `gradle.properties` files, bump the version to a unique value that is not already published in any other repository

3. **Add the local Maven repository**: Add `mavenLocal()` to the `repositories` block of the projects that need to use the locally published versions

4. **Update dependencies**: Update the dependency version in the `libs.versions.toml` file of the dependent projects to match the version in `gradle.properties`

5. **Configure module dependencies**:

   - Go to **Project Structure**
   - Select the `main` module of your project
   - Under the **Dependencies** tab, remove the existing dependencies to `revanced-patcher` or `revanced-library`
   - Add new dependencies by clicking `+` > **Module Dependency**
   - Select `revanced-patcher.main` or `revanced-library.jvmMain`

6. **Set up local publication**:

   - Add **Before launch** tasks in the `revanced-cli` run configuration
   - Use the `publishToMavenLocal` Gradle task to publish the `revanced-patcher` and `revanced-library` projects to your local Maven repository

## ✅ Verify your setup

Now that you have set up your development environment, verify that everything works as intended:

1. **Run ReVanced CLI**:

   - Run the `revanced-cli` project with the run configuration you created
   - Confirm that the CLI starts and executes the command you specified in the program arguments

2. **Edit the projects**:

   Make a small change in the projects and confirm that the changes are reflected, when you run the project

3. **Test debugging**:

   - Set a breakpoint in the projects
   - Run the project in debug mode and confirm that the breakpoint is hit
   - Continue and let ReVanced CLI exit

## ⚠️ Troubleshoot your development environment

- **Projects fail to build**: Ensure that you have the correct JDK version installed. Check the `JAVA_HOME` environment variable and the JDK version in IntelliJ IDEA. Make sure you are authenticated to GitHub Packages if the build fails due to authentication issues
- **Run configuration fails**: Check the program arguments and working directory in the run configuration. Ensure that the paths are correct and up to date with the latest changes in the repositories
- **Breakpoints are not hit**: Ensure that you are running the project in debug mode and that the paths are correct in the run configuration
- **Dependencies are not resolved**: Make sure, the dependencies are published to the local Maven repository, `mavenLocal()` is present in the repositories block and the correct version of the dependencies is specified in the `libs.versions.toml` file
- **Changes in projects are not reflected**: Ensure, that after making changes in the projects, the `revanced-patches` project is built, and the run configuration is updated with the latest path to the patches file. Also, ensure that the libraries are published to the local Maven repository and the dependencies are correctly set up in the **Project Structure** dialog. Ensure, the correct version of the dependencies is specified in the `libs.versions.toml` file

## 📜 Project specific documentations

To learn more about the individual projects, refer to their respective documentations:

- [ReVanced CLI](https://github.com/ReVanced/revanced-cli/tree/main/docs)
- [ReVanced Patcher](https://github.com/ReVanced/revanced-patcher/tree/main/docs)
