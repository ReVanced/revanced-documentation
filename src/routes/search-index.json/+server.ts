import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { RequestHandler } from './$types';

export const prerender = true;

let cachedSearchIndex: string | null = null;

function getSearchIndex(): string | null {
	if (cachedSearchIndex !== null) {
		return cachedSearchIndex;
	}

	try {
		cachedSearchIndex = readFileSync(
			join(process.cwd(), '.svelte-kit/generated/search-index.json'),
			'utf-8',
		);
		return cachedSearchIndex;
	} catch {
		return null;
	}
}

export const GET: RequestHandler = () => {
	const searchIndex = getSearchIndex();
	if (searchIndex === null) {
		return new Response(JSON.stringify({ error: 'Search index is not available yet.' }), {
			status: 503,
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
		});
	}

	return new Response(searchIndex, {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
};
