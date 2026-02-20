import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import type { PageLoad } from './$types';

const components = import.meta.glob('/docs/**/*.md');

export const load: PageLoad = async ({ data }) => {
	const sourcePath = data.sourcePath;
	if (typeof sourcePath !== 'string' || !sourcePath.endsWith('.md')) {
		throw error(500, 'Missing source path for docs page');
	}

	const componentPath = `/docs/${sourcePath}`;
	const loader = components[componentPath];
	if (!loader) {
		throw error(404, 'Page content not found');
	}

	const component = (await loader()) as { default: Component };
	return {
		...data,
		component: component.default,
	};
};
