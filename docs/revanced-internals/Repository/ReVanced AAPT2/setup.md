---
title: ‍🧑‍💻 Building AAPT2
description: Consistency, structuring of the sentences.
hide_table_of_contents: false
---


# ‍🧑‍💻 Building AAPT2

## Setup Android NDK

...

## Clone the repository and submodules

```bash
git clone https://github.com/ReVanced/aapt2
cd aapt2
git submodule update --init --depth 1
```

Notice how there's `--depth 1` argument in the command for cloning the submodule,
this is intentional as we are cloning the Android Open Source Project,
which have lots of commits and takes lots of storages.

## Build the AAPT2 Library

...
