import { error } from '@sveltejs/kit';
import { getAllDocRoutes } from '$lib/core/graph';
import { useDocsRouteData } from '$lib/core/route-data';
import type { PageServerLoad } from './$types';

export const prerender = true;

export function entries() {
	return getAllDocRoutes().map((route) => {
		const slug = route.slice(1);
		return { slug };
	});
}

export const load: PageServerLoad = ({ params }) => {
	if (!params.slug) {
		throw error(404, 'Page not found');
	}

	const slug = params.slug.split('/');
	const routeData = useDocsRouteData(slug);
	if (!routeData) {
		throw error(404, 'Page not found');
	}

	const sourcePath = routeData.page.sourcePath;
	if (!sourcePath.endsWith('.md') || sourcePath.includes('..')) {
		throw error(500, 'Invalid source path for docs page');
	}

	return {
		sourcePath,
		title: routeData.title,
		section: routeData.section.title,
		headings: routeData.headings,
		editUrl: routeData.editUrl,
		pagination: routeData.pagination,
	};
};
