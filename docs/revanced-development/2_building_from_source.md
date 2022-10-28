# Building from source

If you have already downloaded the prebuilt packages you can skip to [Using the ReVanced CLI](7_usage.md).

Before continuing you need to be authenticated to GitHub Packages.
\
This will assume you have a GitHub account. Create a PAT with the scope `read:packages` [here](https://github.com/settings/tokens/new?scopes=read:packages&description=Revanced) and add your token to ~/.gradle/gradle.properties.
\
Example `gradle.properties` file:

```properties
gpr.user = YourUsername
gpr.key = ghp_longrandomkey
```

## Overview

1. [Building the ReVanced Patcher](3_building_revanced_patcher.md)
2. [Building the ReVanced Patches](4_building_revanced_patches.md)
3. [Building the ReVanced Integrations](5_building_revanced_integrations.md)
4. [Building the ReVanced CLI](6_building_revanced_cli.md)
