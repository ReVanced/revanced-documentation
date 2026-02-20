export const DOCS_DIR = 'docs';

export const SITE_NAME = 'Documentation';
export const ORG_NAME = 'ReVanced';
export const SITE_TITLE = `${ORG_NAME} ${SITE_NAME}`;
export const SITE_DESCRIPTION =
	'ReVanced is a modular patcher for Android applications. This documentation covers the ReVanced Patcher, Manager, and CLI.';
export const LOGO_ASSET_PATH = '/logo.svg';
export const SITE_THEME_COLOR = '#1a191f';

function resolveSiteUrl(): string {
	const raw = process.env.SITE_URL_OVERRIDE?.trim() || 'https://docs.revanced.app';
	let parsed: URL;
	try {
		parsed = new URL(raw);
	} catch {
		throw new Error(`Invalid SITE_URL_OVERRIDE value '${raw}'`);
	}
	if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
		throw new Error(`SITE_URL_OVERRIDE must use http or https, got '${parsed.protocol}'`);
	}
	const pathname = parsed.pathname.replace(/\/+$/, '');
	return `${parsed.origin}${pathname === '/' ? '' : pathname}`;
}

export const SITE_URL = resolveSiteUrl();

export const HEADER_BUTTONS = [
	{
		href: 'https://github.com/ReVanced/revanced-documentation',
		label: 'GitHub',
		icon: 'github',
	},
];

export const GITHUB_EDIT_BASE_URL = 'https://github.com/ReVanced';

export const DOCS_SECTIONS = {
	_root: {
		label: 'General',
		order: 0,
		icon: 'home',
		repo: {
			name: 'revanced-documentation',
			branch: 'main',
			docsPath: 'docs',
		},
	},
	patcher: {
		label: 'Patcher',
		order: 1,
		icon: 'hammer',
		repo: {
			name: 'revanced-patcher',
			branch: 'main',
			docsPath: 'docs',
		},
	},
	manager: {
		label: 'Manager',
		order: 2,
		icon: 'cellphone',
		repo: {
			name: 'revanced-manager',
			branch: 'main',
			docsPath: 'docs',
		},
	},
	cli: {
		label: 'CLI',
		order: 3,
		icon: 'console',
		repo: {
			name: 'revanced-cli',
			branch: 'main',
			docsPath: 'docs',
		},
	},
} as const;
