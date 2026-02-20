export type IconName = string;

export interface SitePublicConfigSite {
	name: string;
	org: string;
	title: string;
	description: string;
	logoAssetPath: string;
	headerButtons?: SitePublicConfigHeaderButton[];
	themeColor: string;
}

export interface SitePublicConfigHeaderButton {
	href: string;
	label?: string;
	icon?: IconName;
}

export interface SitePublicConfigSection {
	icon: IconName;
}

export interface SitePublicConfig {
	site: SitePublicConfigSite;
	sections: Record<string, SitePublicConfigSection>;
	siteUrl: string;
}

export interface TableOfContentsHeading {
	id: string;
	title: string;
	level: number;
}

export interface SearchSection {
	heading: string;
	anchor: string;
	text: string;
}

export interface DocNode {
	sourcePath: string;
	workspacePath: string;
	workspaceRealPath: string;
	sectionId: string;
	sectionTitle: string;
	contentSlug: string;
	slug: string;
	routePath: string;
	category: string;
	title: string;
	sidebarLabel: string;
	sidebarOrder: number | null;
	description: string | null;
	headings: TableOfContentsHeading[];
	searchSections: SearchSection[];
	plainText: string;
	editUrl: string;
}

export interface RuntimeDocNode {
	sourcePath: string;
	sectionId: string;
	sectionTitle: string;
	contentSlug: string;
	slug: string;
	routePath: string;
	category: string;
	title: string;
	sidebarLabel: string;
	headings: TableOfContentsHeading[];
	editUrl: string;
}

export interface SectionNode {
	id: string;
	title: string;
	order: number;
	basePath: string;
	isPageAnchor: boolean;
	icon: IconName;
	pages: string[];
}

export interface AssetMetadataEntry {
	width: number;
	height: number;
}

export interface DocsGraph {
	generatedAt: string;
	docs: DocNode[];
	sections: SectionNode[];
	assets: string[];
	assetMetadata: Record<string, AssetMetadataEntry>;
}

export interface RuntimeDocsGraph {
	generatedAt: string;
	docs: RuntimeDocNode[];
	sections: SectionNode[];
}

export interface TableOfContentsItem {
	id: string;
	title: string;
	level: number;
	children?: TableOfContentsItem[];
}

export interface DocsPage {
	slug: string;
	contentSlug: string;
	title: string;
	pageTitle: string;
	category: string;
	routePath: string;
	sourcePath: string;
}

export interface DocsSection {
	id: string;
	title: string;
	basePath: string;
	isPageAnchor: boolean;
	icon: IconName;
	order: number;
	pages: DocsPage[];
}

export interface ClientDocsPage {
	title: string;
	category: string;
	routePath: string;
}

export interface ClientDocsSection {
	id: string;
	title: string;
	basePath: string;
	isPageAnchor: boolean;
	icon: IconName;
	order: number;
	pages: ClientDocsPage[];
}

export interface DocsPaginationLink {
	routePath: string;
	title: string;
	sectionId: string;
	sectionTitle: string;
	sectionIcon: IconName;
}

export interface DocsPagination {
	prev: DocsPaginationLink | null;
	next: DocsPaginationLink | null;
}

export interface DocsRouteData {
	id: string;
	slug: string;
	routePath: string;
	entry: RuntimeDocNode;
	section: DocsSection;
	page: DocsPage;
	headings: TableOfContentsHeading[];
	title: string;
	editUrl: string;
	pagination: DocsPagination;
}
