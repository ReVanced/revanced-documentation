# ReVanced infrastructure

ReVanced infrastructure is simple and overseeable, relying on widely-used open-source tools and services to keep things efficient and cost-effective.

## High level overview

ReVanced uses public social media platforms like Discord, Reddit, Telegram, Twitter and co. to facilitate communication, collaboration and community engagement. ReVanced uses GitHub to host the source code and manage development. ReVanced has presence via its own domain. On this domain ReVanced provides a website and hosts internal and public services like ReVanced API. ReVanced relies on crucial services like Cloudflare or Oracle Cloud Infrastructure. Internal services hosted via Oracle Cloud Infrastructure include own self-hosted instances of various tools and services to keep cost minimal and maximize control. ReVanced is also incorporated in the United States. Corporate administration and governance is done internally with responsible parties of ReVanced and external legal counsel as needed. Some infrastructure also depends on financial matters (e.g. Domain name) or corporation finance (e.g. US registered agent, compliance filings to the state of incorporation or the government). For this reason ReVanced uses OpenCollective and GitHub Sponsors and a crypto wallet to fund its operations and cover expenses. For document management, an instance of Paperless-ngx is self-hosted.

## Detailed overview

### External services

- Cloudflare (CDN, DNS, DDoS protection, Object storage with R2 (up to 10GB free) for infrastructure backups, E-Mail, Zero Trust to protect internal services)
- SMTP2GO (E-Mail delivery service)
- Oracle Cloud Infrastructure (Always Free services for VPS)
- OpenCollective (Open and transparent funding)
- GitHub (Source code hosting and collaboration platform, funds from GitHub Sponsors sent to OpenCollective)
- Various social media platforms (Communication and community engagement)
- Namecheap (Domain registration and management)
- Mercury (Banking)
- Legal and compliance services (USPTO, WIPO, Wyoming Registered Agent)
- Crowdin (Localization and translation management)
- Microsoft Clarity & Google Analytics (User behavior analytics)
- Figma (Design and prototyping)

### Self-hosted services

- Portainer (Management of all of the self-hosted services)
- Watchtower (Automatic container management for updates)
- Nginx (Web server and reverse proxy)
- Forgejo (Self-hosted Git service to ensure independence from GitHub)
- Paperless-ngx (Document management system)
- Vaultwarden (Self-hosted password manager)
- ReVanced Bot (Bot for community engagement and support)
- Wit.ai (Generative AI for ReVanced Bot)
- ReVanced API (Internal API for ReVanced services like ReVanced Manager or ReVanced Website)
- Duplicati (Backup volumes for self-hosted services to Cloudflare R2)
- GoAccess (Analytics for Nginx logs)

## Details

ReVanced uses Oracle Cloud Free Tier services to host a Ubuntu VPS instance (with ESM and unattended upgrades enabled). Only two incoming ports are open for Nginx and OpenSSH (SSH). SSH access is hardened with key-based authentication and other security measures. All self-hosted services are managed using Docker containers via Portainer, including Nginx. Watchtower keeps them up to date. Duplicati is set up to upload volumes to Cloudflare R2. Portainer backs up itself to R2 as well. Nginx is hardened (e.g. to only allow connections from Cloudflare, preventing TLS certificate leakage to expose the IP address of the VPS, generic HTTP security headers and SSL configurations). HTTP is proxied by Cloudflare. For SSH, Cloudflare proxy is disabled, however a random subdomain name is used for security by obscurity. All HTTP services are proxied by Nginx. Vaultwarden is used for passwords and secret storage. 2FA is enforced. Passwords are randomly generated using Bitwarden. Critical services like Vaultwarden, Portainer and co. are protected behind Cloudflare Zero Trust. For external services ReVanced E-Mails are used.

## Critical infrastructure and single points of failures

### Account compromise

- Namecheap: Affects end-users as malware could be distributed. Mitigated by code- and artifact-signing. External services can be compromised due to compromise of E-Mail accounts. Mitigated by using 2FA.
- Cloudflare: This would reveal the VPS IP address. However the IP address can be rotated. E-Mail can be compromised again. Backups on R2 are encrypted and are not affected. Services behind Zero Trust can be compromised. This is mitigated by additional authentication.
- Oracle Cloud: Affects end-users as malware could be distributed. Mitigated by code- and artifact-signing, user permissions and passphrase protected keys for SSH authentication. Deployed secrets and credentials can be compromised, leading to compromise of external services (e.g. ReVanced Bot Discord token).
- Portainer: Affects all self-hosted services including ReVanced API or ReVanced Bot affecting end-users as malware could be distributed. Volumes can be compromised including deployed secrets, leading to compromise of external services. Privilege escalation could compromise the VPS.
- Duplicati: Affects backups of volumes. Encryption keys are stored in the deployment and can be compromised as well, leading to compromise of backup data including other secrets leading to compromise of other services.
- Vaultwarden: Affects password and secret storage leading to compromise of external services and affect end-users as malware could be distributed. Mitigated by password policies, 2FA and Cloudflare Zero Trust.
- Social media platforms: Affects the respective platform. The community may lose trust and engagement if accounts are compromised or misused.

### Supply chain attacks

- GitHub: As multiple maintainers have individual permissions to push changes, malicious code can be introduced into the codebase. Mitigated by code reviews, automated testing, and monitoring for suspicious activity by public contributors Secrets from the GitHub repository can be leaked by dumping them in workflow runs leading to compromise of signing keys. Mitigated by using revokable subkeys. Malware can be re-uploaded in existing GitHub releases. Mitigated by GitHub artifact attestation and artifact-signing.
- Oracle Cloud, Portainer, ReVanced API: These components deliver the releases to end-users. Compromise could redirect to malicious assets. Mitigated by artifact-signing.

### E-Mail

External services are registered with ReVanced E-Mails. Compromise of E-Mail accounts can lead to unauthorized access to these services, potentially resulting in further security incidents. Mitigated by password policies and 2FA.

### Malicious intent

Authorized users with extended access such as maintainers, collaborators or administrators could intentionally or unintentionally introduce vulnerabilities or malicious code into systems in reach. Mitigated by least privilege principle, access controls, code reviews, and monitoring for suspicious activity.

