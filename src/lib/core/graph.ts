import rawGraph from '$generated/docs-runtime-graph.json';
import type { RuntimeDocNode, RuntimeDocsGraph } from '$lib/core/types';

function invariant(condition: boolean, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

function validateDocsGraph(input: unknown): RuntimeDocsGraph {
	invariant(Boolean(input) && typeof input === 'object', 'Invalid docs runtime graph payload');

	const graph = input as RuntimeDocsGraph;
	invariant(Array.isArray(graph.docs), 'docs runtime graph is missing docs[]');
	invariant(Array.isArray(graph.sections), 'docs runtime graph is missing sections[]');

	const sectionIds = new Set<string>();
	for (const section of graph.sections) {
		invariant(
			typeof section.id === 'string' && section.id.length > 0,
			'Section id must be a non-empty string',
		);
		invariant(
			!sectionIds.has(section.id),
			`Duplicate section id '${section.id}' in docs runtime graph`,
		);
		sectionIds.add(section.id);
	}

	const routePaths = new Set<string>();
	for (const doc of graph.docs) {
		invariant(
			typeof doc.routePath === 'string' && doc.routePath.startsWith('/'),
			`Invalid routePath for ${doc.sourcePath}`,
		);
		invariant(
			typeof doc.sourcePath === 'string' && doc.sourcePath.endsWith('.md'),
			`Invalid sourcePath for ${doc.routePath}`,
		);
		invariant(
			sectionIds.has(doc.sectionId),
			`Unknown section id '${doc.sectionId}' in docs runtime graph`,
		);
		invariant(
			!routePaths.has(doc.routePath),
			`Duplicate route path '${doc.routePath}' in docs runtime graph`,
		);
		routePaths.add(doc.routePath);
	}

	const knownRoutes = new Set(graph.docs.map((doc) => doc.routePath));
	for (const section of graph.sections) {
		for (const routePath of section.pages) {
			invariant(
				knownRoutes.has(routePath),
				`Section '${section.id}' references unknown route '${routePath}'`,
			);
		}
	}

	return graph;
}

let cached: {
	graph: RuntimeDocsGraph;
	byRoutePath: Map<string, RuntimeDocNode>;
	bySourcePath: Map<string, RuntimeDocNode>;
} | null = null;

function ensureLoaded() {
	if (cached) return cached;

	const graph = validateDocsGraph(rawGraph);
	cached = {
		graph,
		byRoutePath: new Map(graph.docs.map((doc) => [doc.routePath, doc])),
		bySourcePath: new Map(graph.docs.map((doc) => [doc.sourcePath, doc])),
	};
	return cached;
}

export function getDocsGraph(): RuntimeDocsGraph {
	return ensureLoaded().graph;
}

export function getDocBySourcePath(sourcePath: string): RuntimeDocNode | undefined {
	return ensureLoaded().bySourcePath.get(sourcePath);
}

export function getDocByRoutePath(routePath: string): RuntimeDocNode | undefined {
	return ensureLoaded().byRoutePath.get(routePath);
}

export function getAllDocRoutes(): string[] {
	return ensureLoaded().graph.docs.map((doc) => doc.routePath);
}
