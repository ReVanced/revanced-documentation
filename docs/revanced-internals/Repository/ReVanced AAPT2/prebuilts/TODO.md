---
title: 📔 Prebuilt verification
description: Handling prebuilt libraries that exists in ReVanced Manager.
hide_table_of_contents: false
---

# 📔 How to handle prebuilts library

ReVanced Manager uses prebuilt library from AAPT2 in order to handle Android APK resources files,
such file are meant to be verified by GitHub Attestation within the ReVanced organisation.

## How to verify prebuilt library

Requirements
  - Have the latest version of GitHub CLI installed on your computer

Verify the library by atttesting the file using this command:

```bash
gh at verify {prebuilt location} --owner ReVanced
```

> ⚡ **DANGER**
> If you use libraries from 3rd party (not ReVanced), replace the owner parametre to their user/organisation.
> **Make sure that you trust them first**, then update the ownership in the documentation to let everyone know
> that ownership is changed. (Optional)
