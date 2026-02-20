import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { DOCS_DIR, SITE_DESCRIPTION, SITE_TITLE } from '../site.config.js';
import type { DocsGraph } from '../src/lib/core/types';

interface LlmsSourceDocument {
	content: string;
	includeInLlms: boolean;
}

function parseLlmsSource(rawMarkdown: string): LlmsSourceDocument {
	const parsed = matter(rawMarkdown);
	const includeInLlms = parsed.data?.llms !== false;
	return {
		content: parsed.content.trim(),
		includeInLlms,
	};
}

function buildLlmsDocument(
	graph: DocsGraph,
	options: { title: string; description: string },
	readSourceMarkdown: (sourcePath: string) => string,
): string {
	const docsByRoute = new Map(graph.docs.map((doc) => [doc.routePath, doc]));
	const parts: string[] = [`# ${options.title}`, '', options.description, ''];

	for (const section of graph.sections) {
		const sectionParts: string[] = [];

		for (const routePath of section.pages) {
			const doc = docsByRoute.get(routePath);
			if (!doc) {
				throw new Error(`Missing docs graph node for route '${routePath}'`);
			}

			const source = parseLlmsSource(readSourceMarkdown(doc.sourcePath));
			if (!source.includeInLlms || !source.content) {
				continue;
			}

			sectionParts.push(`### ${doc.title}`, `Source: ${doc.routePath}`, '', source.content, '');
		}

		if (sectionParts.length === 0) {
			continue;
		}

		parts.push('---', `## ${section.title}`, '', ...sectionParts);
	}

	return `${parts.join('\n').trimEnd()}\n`;
}

const graphPath = join(process.cwd(), '.svelte-kit/generated/docs-graph.json');
const graph = JSON.parse(readFileSync(graphPath, 'utf-8')) as DocsGraph;

const llmsDocument = buildLlmsDocument(
	graph,
	{
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
	},
	(sourcePath) => {
		const sourceAbsolutePath = join(process.cwd(), DOCS_DIR, sourcePath);
		return readFileSync(sourceAbsolutePath, 'utf-8');
	},
);

const outDir = join(process.cwd(), 'build');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'llms.txt'), llmsDocument);
