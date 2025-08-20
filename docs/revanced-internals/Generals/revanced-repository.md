---
title: 🧑‍🍳 Setting up a ReVanced repository for the first time
description: How to configure a repository to be ReVanced compliants.
hide_table_of_contents: false
---

# 🧑‍🍳 How do you setup an authentic ReVanced Repository?

To cook up your very first, authentic ReVanced Repository,
you need to make sure it has:

## Proper README Structure

Every repository at ReVanced will feature the iconic structure of...

## Consistent CI Configuration

Each CI is configured with GitHub Actions, over time this might before Forgejo

Always preferred 'single quote' over "double quote" when possible

## Contributing guidelines

## Security Policy

There are no rules on how long should you support a software after it release.

## Issue template

## Misc

To make sure that every new contributor receive a warm welcome, 
create `config.yml` file in `.github` directory and add the following content:

```yml
firstPRMergeComment: >
  ❤️ Thank you for contributing to ReVanced. Join us on [Discord](https://revanced.app/discord) to receive a role for your contribution.
```

To make sure that dependencies are all getting updated automatically,
create `dependabot.yml` file in `.github` directory and set it up to your project requirements.
