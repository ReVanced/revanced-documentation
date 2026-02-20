import { getDocBySourcePath } from '$lib/core/graph';
import { getPageInfoByRoutePath, getPaginationForRoute } from '$lib/core/navigation';
import type { DocsRouteData } from '$lib/core/types';

export function useDocsRouteData(slug: string[]): DocsRouteData | null {
	const routePath = `/${slug.join('/')}`;
	const pageInfo = getPageInfoByRoutePath(routePath);
	if (!pageInfo) {
		return null;
	}

	const entry = getDocBySourcePath(pageInfo.page.sourcePath);
	if (!entry) {
		throw new Error(`Missing docs graph entry for ${pageInfo.page.sourcePath}`);
	}

	return {
		id: entry.sourcePath,
		slug: routePath.slice(1),
		routePath,
		entry,
		section: pageInfo.section,
		page: pageInfo.page,
		headings: entry.headings,
		title: entry.title,
		editUrl: entry.editUrl,
		pagination: getPaginationForRoute(routePath),
	};
}
