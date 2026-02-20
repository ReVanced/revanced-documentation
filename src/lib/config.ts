import type { Component } from 'svelte';
import rawSitePublicConfig from '$generated/site-public.json';
import type { SitePublicConfig } from '$lib/core/types';
import IconCellphone from '~icons/mdi/cellphone';
import IconConsole from '~icons/mdi/console';
import IconGithub from '~icons/mdi/github';
import IconHammer from '~icons/mdi/hammer';
import IconHelpCircleOutline from '~icons/mdi/help-circle-outline';
import IconHome from '~icons/mdi/home';

const config = rawSitePublicConfig as SitePublicConfig;

export const SITE_URL = config.siteUrl;

export const SITE_NAME = config.site.name;
export const ORG_NAME = config.site.org;
export const SITE_TITLE = config.site.title;
export const SITE_DESCRIPTION = config.site.description;
export const LOGO_ASSET_PATH = config.site.logoAssetPath;
export const HEADER_BUTTONS = config.site.headerButtons ?? [];
export const SITE_THEME_COLOR = config.site.themeColor;

type IconComponent = Component<{ width?: number | string; height?: number | string }>;

const iconComponents: Record<string, IconComponent> = {
	home: IconHome,
	hammer: IconHammer,
	cellphone: IconCellphone,
	console: IconConsole,
	github: IconGithub,
	'help-circle-outline': IconHelpCircleOutline,
};

const fallbackIcon: IconComponent = IconHelpCircleOutline;

export const sectionIcons: Record<string, IconComponent> = Object.fromEntries(
	Object.entries(config.sections).map(([sectionId, section]) => [
		sectionId,
		iconComponents[section.icon] ?? fallbackIcon,
	]),
);

export function getIconComponent(name: string): IconComponent {
	return iconComponents[name] ?? fallbackIcon;
}
