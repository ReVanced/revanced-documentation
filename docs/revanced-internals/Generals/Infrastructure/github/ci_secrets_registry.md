---
title: 🏗️ Infrastructure Variable / Secrets (GitHub)
description: ReVanced Infrastructure's variable and secrets configuration (GitHub)
hide_table_of_contents: false
---

# 🏗️ Infra variable / secrets

Like with every organisation, variables, secrets are part of the
CI infra system. Here's an list to find.

* DMCA Guild: ${{ vars.RV_DMCA_GUID }}
* Google Tag Manager ID: ${{ vars.RV_GOOGLE_TAG_MANAGER_ID }}
* ReVanced API: ${{ vars.RV_API_URL }}
* Cloudflare Account: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
* Cloudflare API Token: ${{ secrets.CLOUDFLARE_API_TOKEN }}
* Crowdin Project ID: ${{ secrets.CROWDIN_PROJECT_ID }}
* Crowdin Token ${{ secrets.CROWDIN_PERSONAL_TOKEN }}
* GPG Private Key: ${{ secrets.GPG_PRIVATE_KEY }}
* GPG Password: ${{ secrets.GPG_PASSPHRASE }}
* GPG Fingerprint: ${{ vars.GPG_FINGERPRINT }}
* Discord Bot Portainer webhook: ${{ secrets.DISCORD_BOT_PORTAINER_WEBHOOK_URL }}
* Websocket API Portainer webhook: ${{ secrets.WEBSOCKET_API_PORTAINER_WEBHOOK_URL }}
* GitHub Registry Container deletion permission: ${{ secrets.DELETE_PACKAGES_TOKEN }}
* Keystore binary data: ${{ secrets.KEYSTORE }}
* Keystore Password: ${{ secrets.KEYSTORE_PASSWORD }}
* Keystore Entry Alias: ${{ secrets.KEYSTORE_ENTRY_ALIAS }}
* Keystore Entry Password: ${{ secrets.KEYSTORE_ENTRY_PASSWORD }}
* ReVanced Documentation push permission: ${{ secrets.DOCUMENTATION_REPO_ACCESS_TOKEN  }}

## Deprecation/Discouraged

* Repository Push permission: ${{ secrets.REPOSITORY_PUSH_ACCESS }}

## Removed

* ReVanced Manager Extra Environment Configuration (Sentry.io Data Source Name aka. Logging, and OTA Crowdin Translation Delivery): ${{ secrets.SECRETS }}

## Migration

* ${{ secrets.SIGNING_KEY_PASSWORD }} -> ${{ secrets.KEYSTORE_ENTRY_PASSWORD }}
* ${{ secrets.SIGNING_KEY_ALIAS }} -> ${{ secrets.KEYSTORE_ENTRY_ALIAS }}
* ${{ secrets.SIGNING_KEYSTORE_PASSWORD }} -> ${{ secrets.KEYSTORE_PASSWORD }}
* ${{ secrets.SIGNING_KEYSTORE }} -> ${{ secrets.KEYSTORE }}

* ${{ secrets.SECRETS }} -> Removed
* ${{ secrets.REPOSITORY_PUSH_ACCESS }} -> ${{ secrets.GITHUB_TOKEN }} with `contents: write` permission
