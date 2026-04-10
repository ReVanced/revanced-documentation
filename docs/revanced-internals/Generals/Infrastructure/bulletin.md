---
title: 🏗️ Infrastructure Bulletin
description: Track changes through the ReVanced Infrastructure Bulletin
hide_table_of_contents: false
---

# 🏗️ Infrastructure Bulletin

## Change `10072025-TESTING` (Testing only)

  - Merge Dependabot dependency update into one

    ```yml
    version: 2
    multi-ecosystem-groups:
      dependency: # (A) Can be named any
        schedule:
          interval: "weekly"
          target-branch: dev

    updates:
      - package-ecosystem: "github-actions"
        directory: "/"
        multi-ecosystem-group: "infrastructure" # Set this to (A)
        patterns: # You must have patterns or else dependabot will fail to work
          - "*"
    ```

## Change `01072025` (Production ready)

  - Remove fetch-depth from checkout action

    ```diff
    steps:
      # Checkout action
      - name: Checkout
        uses: actions/checkout@v4
    -   with:
    -     fetch-depth: 0
    ```

## Change `10062025` (Production ready)

  - Use semantic release actions instead of script

    ```diff
    # see: https://github.com/cycjimmy/semantic-release-action
    - - name: Release
    -   run: npx semantic-release
    + - name: Release
    +   uses: cycjimmy/semantic-release-action@v4
    +   id: release
    +   env:
    +     GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    ```

- Remove revanced-bot repository access token
  - Use ${{ secrets.GITHUB_TOKEN }} with `contents: write` permission instead

## Change `01052025` (Production ready)

- Specify `subject-name` on attestation action with the format of `ReVanced <name> <git-tag/version>`

    ```diff
    - name: Attest
      uses: actions/attest-build-provenance@v2
      with:
    +   subject-name: 'ReVanced Foobar ${{ steps.release.outputs.new_release_git_tag }}'
        subject-path: revanced-foobar-*.apk # Standard globs allowed only
    ```

## Change `01012025` (Production ready)

  - (Gradle-specific) Automatically update Gradle wrapper with CI
    - See [update_gradle_wrapper.yml](/Generals/Infrastructure/github/ci_template/gradle-specific/update_gradle_wrapper.yml)

## Change `01122024` (Production ready)

  - (Gradle-specific) Add Gradle cache action to CI

    ```diff
    # see: https://github.com/burrunan/gradle-cache-action
    + - name: Cache Gradle
    +   uses: burrunan/gradle-cache-action@v3
    ```

## Change `01112024` (Production ready)

  - Add attestation action to CI

    ```diff
    + permissions:
    +   id-token: write
    +   attestations: write
    # see: https://github.com/actions/attest-build-provenance
    + - name: Attest
    +   uses: actions/attest-build-provenance@v2
    +   with:
    +     subject-path: revanced-foobar-*.apk # Standard globs allowed only
    ```

  - Remove revanced-bot repository access token
    - Use ${{ secrets.GITHUB_TOKEN }} with `contents: write` permission instead
