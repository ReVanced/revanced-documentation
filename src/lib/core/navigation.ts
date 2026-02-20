import type {
	ClientDocsSection,
	DocsPage,
	DocsPagination,
	DocsPaginationLink,
	DocsSection,
} from '$lib/core/types';
import { getDocByRoutePath, getDocsGraph } from './graph';

function routeSlug(routePath: string, basePath: string): string {
	if (!basePath) {
		return routePath.slice(1);
	}

	const prefix = `/${basePath}/`;
	if (!routePath.startsWith(prefix)) {
		throw new Error(`Route '${routePath}' does not match section base path '${basePath}'`);
	}

	return routePath.slice(prefix.length);
}

function buildSectionPages(section: { basePath: string; pages: string[] }): DocsPage[] {
	return section.pages.map((routePath) => {
		const doc = getDocByRoutePath(routePath);
		if (!doc) {
			throw new Error(`Missing doc for route '${routePath}'`);
		}

		return {
			slug: routeSlug(routePath, section.basePath),
			contentSlug: doc.contentSlug,
			title: doc.sidebarLabel,
			pageTitle: doc.title,
			category: doc.category,
			routePath: doc.routePath,
			sourcePath: doc.sourcePath,
		};
	});
}

let cached: {
	navigation: DocsSection[];
	routeToPageInfo: Map<string, { section: DocsSection; page: DocsPage }>;
	paginationByRoute: Map<string, DocsPagination>;
} | null = null;

function ensureBuilt() {
	if (cached) return cached;

	const docsGraph = getDocsGraph();

	const navigation: DocsSection[] = docsGraph.sections.map((section) => ({
		id: section.id,
		title: section.title,
		basePath: section.basePath,
		isPageAnchor: section.isPageAnchor,
		icon: section.icon,
		order: section.order,
		pages: buildSectionPages(section),
	}));

	const routeToPageInfo = new Map<string, { section: DocsSection; page: DocsPage }>();
	for (const section of navigation) {
		for (const page of section.pages) {
			routeToPageInfo.set(page.routePath, { section, page });
		}
	}

	const orderedPages: DocsPaginationLink[] = navigation.flatMap((section) =>
		section.pages.map((page) => ({
			routePath: page.routePath,
			title: page.title,
			sectionId: section.id,
			sectionTitle: section.title,
			sectionIcon: section.icon,
		})),
	);

	const paginationByRoute = new Map<string, DocsPagination>();
	for (let index = 0; index < orderedPages.length; index += 1) {
		const current = orderedPages[index];
		if (!current) continue;

		paginationByRoute.set(current.routePath, {
			prev: index > 0 ? (orderedPages[index - 1] ?? null) : null,
			next: index < orderedPages.length - 1 ? (orderedPages[index + 1] ?? null) : null,
		});
	}

	cached = { navigation, routeToPageInfo, paginationByRoute };
	return cached;
}

function toClientSection(section: DocsSection): ClientDocsSection {
	return {
		id: section.id,
		title: section.title,
		basePath: section.basePath,
		isPageAnchor: section.isPageAnchor,
		icon: section.icon,
		order: section.order,
		pages: section.pages.map((page) => ({
			title: page.title,
			category: page.category,
			routePath: page.routePath,
		})),
	};
}

export function getPageInfoByRoutePath(
	routePath: string,
): { section: DocsSection; page: DocsPage } | null {
	return ensureBuilt().routeToPageInfo.get(routePath) ?? null;
}

export function getPageInfo(slug: string[]): { section: DocsSection; page: DocsPage } | null {
	const routePath = `/${slug.join('/')}`;
	return getPageInfoByRoutePath(routePath);
}

export function getDocsNavigation(): DocsSection[] {
	return ensureBuilt().navigation;
}

export function getClientDocsNavigation(): ClientDocsSection[] {
	return ensureBuilt().navigation.map(toClientSection);
}

export function getPaginationForRoute(routePath: string): DocsPagination {
	return ensureBuilt().paginationByRoute.get(routePath) ?? { prev: null, next: null };
}
