import MiniSearch from 'minisearch';
import { resolve } from '$app/paths';

const SEARCH_FUZZY = 0.15;
const SEARCH_PREFIX = true;
const SEARCH_COMBINE_WITH = 'AND' as const;
const SNIPPET_MAX_LENGTH = 140;
const SNIPPET_CONTEXT_CHARS = 40;
const SNIPPET_ELLIPSIS = '...';
const HIGHLIGHT_TAG = 'mark';

const MINISEARCH_OPTIONS = {
	fields: ['title', 'text', 'section'],
	storeFields: ['title', 'section', 'sectionId', 'sectionIcon', 'url', 'anchor', 'text'],
	searchOptions: {
		boost: { title: 4, section: 2, text: 1 },
		fuzzy: SEARCH_FUZZY,
		prefix: SEARCH_PREFIX,
		combineWith: SEARCH_COMBINE_WITH,
	},
};

let instance: MiniSearch | null = null;
let loadPromise: Promise<MiniSearch> | null = null;

export function getIndex(): MiniSearch | null {
	return instance;
}

export function isReady(): boolean {
	return instance !== null;
}

export async function ensureIndex(): Promise<MiniSearch> {
	if (instance) return instance;
	if (loadPromise) return loadPromise;

	loadPromise = (async () => {
		try {
			const res = await fetch(resolve('/search-index.json'));
			if (!res.ok) throw new Error(`Failed to fetch search index: ${res.status}`);
			const json = await res.text();
			instance = MiniSearch.loadJSON(json, MINISEARCH_OPTIONS);
			return instance;
		} catch (e) {
			loadPromise = null;
			console.error('Failed to load search index:', e);
			throw e;
		}
	})();

	return loadPromise;
}

export interface SearchHit {
	id: string;
	title: string;
	section: string;
	sectionId: string;
	sectionIcon: string;
	url: string;
	anchor: string;
	text: string;
	score: number;
}

interface SearchIndexResult {
	id: string | number;
	title: string;
	section: string;
	sectionId: string;
	sectionIcon?: string;
	url: string;
	anchor: string;
	text: string;
	score: number;
}

export function search(query: string): SearchHit[] {
	const ms = getIndex();
	if (!ms || !query.trim()) return [];

	const raw = ms.search(query, {
		combineWith: SEARCH_COMBINE_WITH,
	});

	return raw.map((result) => {
		const entry = result as unknown as SearchIndexResult;
		return {
			id: String(entry.id),
			title: entry.title,
			section: entry.section,
			sectionId: entry.sectionId,
			sectionIcon: entry.sectionIcon ?? '',
			url: entry.url,
			anchor: entry.anchor,
			text: entry.text,
			score: entry.score,
		};
	});
}

function escapeHtml(str: string): string {
	return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function escapeRegex(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function queryTerms(query: string): string[] {
	return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function matchRegex(query: string): RegExp | null {
	const terms = query.trim().split(/\s+/).filter(Boolean);
	if (terms.length === 0) return null;

	return new RegExp(`(${terms.map(escapeRegex).join('|')})`, 'gi');
}

export function highlightMatch(text: string, query: string): string {
	const escaped = escapeHtml(text);
	const regex = matchRegex(query);
	if (!regex) return escaped;
	return escaped.replace(regex, `<${HIGHLIGHT_TAG}>$1</${HIGHLIGHT_TAG}>`);
}

export function getSnippet(text: string, query: string, maxLen = SNIPPET_MAX_LENGTH): string {
	const normalizedText = text.replace(/\s+/g, ' ').trim();
	if (!normalizedText) {
		return '';
	}

	const snippetLength = maxLen > 0 ? maxLen : 1;
	if (normalizedText.length <= snippetLength) {
		return normalizedText;
	}

	const lowerText = normalizedText.toLowerCase();
	const terms = queryTerms(query);
	let matchIndex = 0;

	for (const term of terms) {
		const index = lowerText.indexOf(term);
		if (index >= 0) {
			matchIndex = index;
			break;
		}
	}

	let snippetStart = matchIndex - SNIPPET_CONTEXT_CHARS;
	if (snippetStart < 0) {
		snippetStart = 0;
	}

	let snippetEnd = snippetStart + snippetLength;
	if (snippetEnd > normalizedText.length) {
		snippetEnd = normalizedText.length;
	}

	let snippet = normalizedText.slice(snippetStart, snippetEnd).trim();
	if (snippetStart > 0) {
		snippet = `${SNIPPET_ELLIPSIS}${snippet}`;
	}
	if (snippetEnd < normalizedText.length) {
		snippet += SNIPPET_ELLIPSIS;
	}

	return snippet;
}
