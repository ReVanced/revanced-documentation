---
title: 🚀 ReVanced API Migration guide (user)
description: Migrating off deprecated/removed configuration for consumer-side.
hide_table_of_contents: false
---

# How to migrating to latest version of ReVanced API

This guide is exclusively for implementers

## V2 (v1.3.0) -> V3/V4 (v1.4.0, v1.5.0, v1.6.0)

The following API have been removed:

| API                               | Replacement            |
|:----------------------------------|:-----------------------|
| `/v1/{repo}/latest`               | `/v1/{repo}`           |
| `/v1/{repo}/latest/version`       | `/v1/{repo}/version`   |
| `/v1/{repo}/latest/list`          | `/v1/{repo}/list`      |
| `/v1/{repo}/latest/keys`          | `/v1/{repo}/keys`      |

## V1 (v1.0.0, v1.1.0) -> V2 (v1.2.0, v1.3.0)

The following API have been deprecated:

| API                               | Replacement            |
|:----------------------------------|:-----------------------|
| `/v1/{repo}/latest`               | `/v1/{repo}`           |
| `/v1/{repo}/latest/version`       | `/v1/{repo}/version`   |
| `/v1/{repo}/latest/list`          | `/v1/{repo}/list`      |
| `/v1/{repo}/latest/keys`          | `/v1/{repo}/keys`      |
