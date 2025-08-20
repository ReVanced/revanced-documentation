---
title: 🚀 ReVanced API Migration guide (host)
description: Migrating off deprecated/removed configuration for hostees.
hide_table_of_contents: false
---

# 🚀 How to migrating to latest version of ReVanced API

This guide is exclusively for API hosters

## V4 (v1.5.0) -> V4 (v1.6.0)

Add `status` field to lead user to uptime status page.

```json
{
  "status": "https://status.revanced.app",
}
```

## V2 (v1.3.0) -> V3 (v1.4.0, v1.5.0)

Never include a field for `integrations` as it's removed because ReVanced Patches now merged with ReVanced Integrations repository rendering Integrations repo useless.

```diff
organization = "foobar"
patches = { ... }
-integrations = { ... }
manager = { ... }
contributors-repositories = [ ...]
api-version = 1
cors-allowed-hosts = [ ... ]
endpoint = "http://example.com"
old-api-endpoint = "https://old-api.example.com"
static-files-path = "static/root"
versioned-static-files-path = "static/versioned"
about-json-file-path = "about.json"
```

Your `configuration.toml` look like this before v1.4.0

```diff
organization = "foobar"
patches = { ... }
manager = { ... }
contributors-repositories = [ ...]
api-version = 1
cors-allowed-hosts = [ ... ]
endpoint = "http://example.com"
old-api-endpoint = "https://old-api.example.com"
static-files-path = "static/root"
versioned-static-files-path = "static/versioned"
about-json-file-path = "about.json"
```

This is now the next format of `configuration.toml` after v1.4.0

Legends:
* Blue, modified
* Green, added
* Red, removed

```diff
+++ api-version = "v1"
cors-allowed-hosts = [
    "example.com",
    "*.example.com"
]
endpoint = "https://api.example.com"
static-files-path = "static/root"
versioned-static-files-path = "static/versioned"
+backend-service-name = "GitHub"
about-json-file-path = "about.json"
organization = "foobar"

[patches]
repository = "revanced-patches"
asset-regex = "rvp$"
signature-asset-regex = "asc$"
public-key-file = "static/root/keys.asc"
public-key-id = 1234567890

[manager]
repository = "revanced-manager"
asset-regex = "apk$"

+++ [contributors-repositories]
+++ revanced-patcher = "ReVanced Patcher"
+++ revanced-patches = "ReVanced Patches"
+++ revanced-website = "ReVanced Website"
+++ revanced-cli = "ReVanced CLI"
+++ revanced-manager = "ReVanced Manager"
```


## V1 (v1.0.0, v1.1.0) -> V2 (v1.2.0, v1.3.0)

In `configuration.toml`, you need to specify the directory to static & versioned static, and about information to the API.

```diff
organization = "foobar"
patches = { ... }
integrations = { ... }
manager = { ... }
contributors-repositories = [ ...]
api-version = 1
cors-allowed-hosts = [ ... ]
endpoint = "http://example.com"
old-api-endpoint = "https://old-api.example.com"
+static-files-path = "static/root"
+versioned-static-files-path = "static/versioned"
+about-json-file-path = "about.json"
```

### Static files

Hostee need to offer a directory to the API about static & versioned static files.

This is use to store your public gpg key.

### About configuration

Starting in v1.1.0, API providers need to config an about information.
See example for more information.
