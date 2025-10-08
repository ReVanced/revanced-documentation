# ReVanced trust

ReVanced uses cryptography to ensure trust.

## Signing

Assets such as the patches or tools, or messages like announcements, changelogs or certificates are signed with a GPG key. For each purpose, an individual subkey may be used.

## Verification

The following steps are necessary to verify signatures:

1. Obtain the signing key: Before you can verify a signature, you need to obtain the public key of the signer. This key is usually shared via a trusted channel, such as a website or a key server. ReVanced publishes its keys at [api.revanced.app/keys](https://api.revanced.app/keys). Import the key with `gpg --import <key-file>`.
2. Trust the signing key: After obtaining the public key, you need to trust, that it is the correct key. A simple method to establish trust is to compare the signing key's fingerprint with that of a handful of signed assets or messages. If the fingerprints match, this means, the key is associated with them. For higher assurance, you need to verify the key's fingerprint through multiple independent sources, such as official social media accounts, community forums, or other trusted individuals and sources.
3. Verify the signature: Once you have the public key and have established trust in it, you can use it to verify the signature of subsequent assets or messages. This is typically done using the `gpg` command-line tool: `gpg --verify <signature-file> <signed-file>`.

### Verifying certificates

To verify a certificate, follow the same steps as above. The certificate itself is a signed message, so you can verify it like any other signed message. A certificate should also include the public key of the entity it is issued to, so you can verify that the certificate is indeed issued to the correct entity. To prove that an entity is indeed the holder of the private key associated with the public key in the certificate, request a message signed with the private key and verify it with the public key from the certificate. Require a challenge to be signed alongside the message to prevent replay attacks.

## Revocation

In case a signing key is compromised or lost, it can be revoked. Revocation certificates will appear at [api.revanced.app/keys](https://api.revanced.app/keys) as well as [keyserver.ubuntu.com](https://keyserver.ubuntu.com/).

## Notable scenarios

- Next to ReVanced signing release assets, GitHub provides [artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations) to proof that a build was created by a specific workflow. This can be used to link a release asset to a specific commit or tag in the source code repository. WIth this, you can trust GitHub that our assets were built from the source code we publish and at the same time, trust ReVanced that the assets are official ReVanced assets, giving you bidirectional trust, independent of each other. ReVanced Manager, ReVanced API, ReVanced CLI and similar are examples that are or will rely on this to ensure trust
- Permission to use copyrighted brand assets is granted in the form of a GPG-signed message
