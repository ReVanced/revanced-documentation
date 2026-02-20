import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import { createHighlighter } from 'shiki';
import { SITE_URL } from './site.config.js';
import { rehypeDocLinks } from './src/lib/utils/rehype-plugins.js';

const SHIKI_THEME = 'github-dark';
const DOCS_ASSETS_PATH = '/assets/docs';
const DOCS_GRAPH_PATH = '.svelte-kit/generated/docs-graph.json';
const SVELTEKIT_OUT_DIR = '.svelte-kit';
const SHIKI_LANGUAGES = [
	'javascript',
	'typescript',
	'kotlin',
	'java',
	'bash',
	'json',
	'groovy',
	'svelte',
	'html',
	'css',
	'properties',
	'xml',
	'yaml',
	'shell',
	'markdown',
];

let highlighterPromise = null;

function getSiteBasePath(siteUrl) {
	const pathname = new URL(siteUrl).pathname.replace(/\/+$/, '');
	return pathname === '/' ? '' : pathname;
}

const SITE_BASE_PATH = getSiteBasePath(SITE_URL);

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: [SHIKI_THEME],
			langs: SHIKI_LANGUAGES,
		});
	}
	return highlighterPromise;
}

function resolveLang(highlighter, lang) {
	if (!lang) return 'text';
	try {
		highlighter.getLanguage(lang);
		return lang;
	} catch {
		return 'text';
	}
}

function withBase(pathname) {
	return `${SITE_BASE_PATH}${pathname}`;
}

const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			rehypePlugins: [
				rehypeSanitize,
				rehypeSlug,
				[
					rehypeAutolinkHeadings,
					{
						behavior: 'append',
						properties: {
							className: ['heading-anchor'],
							'aria-label': 'Link to this section',
						},
						content: [
							{
								type: 'element',
								tagName: 'span',
								properties: { className: ['heading-anchor-icon'], 'aria-hidden': 'true' },
								children: [{ type: 'text', value: '#' }],
							},
						],
					},
				],
				[
					rehypeDocLinks,
					{
						docsGraphPath: DOCS_GRAPH_PATH,
						siteBasePath: SITE_BASE_PATH,
						assetsPublicPath: DOCS_ASSETS_PATH,
					},
				],
			],
			highlight: {
				highlighter: async (code, lang) => {
					const highlighter = await getHighlighter();
					const highlighted = highlighter.codeToHtml(code, {
						lang: resolveLang(highlighter, lang),
						theme: SHIKI_THEME,
					});
					const wrapped = [
						'<div class="code-block-wrapper">',
						'<button type="button" class="code-copy-btn" aria-label="Copy code">Copy</button>',
						highlighted,
						'</div>',
					].join('');
					const escaped = wrapped.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
					return `{@html \`${escaped}\`}`;
				},
			},
		}),
	],
	kit: {
		outDir: SVELTEKIT_OUT_DIR,
		alias: {
			$generated: `${SVELTEKIT_OUT_DIR}/generated`,
		},
		paths: {
			base: SITE_BASE_PATH,
		},
		inlineStyleThreshold: 0,
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: true,
			strict: true,
		}),
		prerender: {
			handleHttpError: ({ path: prerenderPath, message }) => {
				if (prerenderPath === withBase('/favicon.ico') || prerenderPath === withBase('/logo.png')) {
					return;
				}
				if (prerenderPath.startsWith(withBase('/assets/'))) {
					return;
				}
				throw new Error(message);
			},
			handleMissingId: 'fail',
		},
	},
};

export default config;
