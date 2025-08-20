---
title: 🪪 Securing build binaries
description: Improving attestability, transparency and security of the build binary.
hide_table_of_contents: false
---

# 🪪 Attestation

Starting in 2025, ReVanced now required all repository to offered GitHub Attestation which provide SLSA v1.0 L2 by default

To implement it, you need to add https://github.com/actions/attest-build-provenance

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
