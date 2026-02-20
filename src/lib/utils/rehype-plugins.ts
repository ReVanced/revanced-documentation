import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import type { Element, Root as HastRoot, Parent } from 'hast';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';
import {
	normalizePath,
	parseLocalAssetHref,
	parseMarkdownDocHref,
	resolveDocRelativePath,
	withQueryAndHash,
} from '../core/href-utils.js';

type NodeProperties = Record<string, unknown>;

interface DocsGraphConfig {
	docs: Array<{
		sourcePath: string;
		routePath: string;
		workspacePath: string;
		workspaceRealPath: string;
	}>;
	assets: string[];
	assetMetadata: Record<string, { width: number; height: number }>;
}

interface DocsGraphContext {
	sourceToRoute: Record<string, string>;
	filePathToSourcePath: Record<string, string>;
	assetPathSet: Set<string>;
	assetMetadataByPath: Record<string, { width: number; height: number }>;
}

function withBasePath(pathname: string, siteBasePath: string): string {
	if (!siteBasePath || siteBasePath === '/') {
		return pathname;
	}
	const normalizedBase = siteBasePath.endsWith('/') ? siteBasePath.slice(0, -1) : siteBasePath;
	return `${normalizedBase}${pathname}`;
}

function inferSourcePath(
	filePath: string,
	filePathToSourcePath: Record<string, string>,
): string | null {
	const normalized = normalizePath(filePath);
	const cwdRelative = normalizePath(path.relative(process.cwd(), normalized));
	const candidates = [
		normalized,
		normalized.replace(/^\.\//, ''),
		cwdRelative,
		cwdRelative.replace(/^\.\//, ''),
	];

	const docsIndex = normalized.lastIndexOf('/docs/');
	if (docsIndex !== -1) {
		candidates.push(normalized.slice(docsIndex + '/docs/'.length));
	}

	for (const candidate of candidates) {
		const sourcePath = filePathToSourcePath[candidate];
		if (sourcePath) {
			return sourcePath;
		}
	}

	return null;
}

function getProperties(node: Element): NodeProperties {
	if (!node.properties) {
		node.properties = {};
	}
	return node.properties as NodeProperties;
}

function parseNumericDimension(value: unknown): number | null {
	if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
		return value;
	}

	if (typeof value !== 'string') {
		return null;
	}

	const normalized = value.trim().toLowerCase();
	if (!normalized || normalized.endsWith('%')) {
		return null;
	}

	const numericPart = normalized.endsWith('px') ? normalized.slice(0, -2).trim() : normalized;
	const parsed = Number.parseFloat(numericPart);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function createPlaceholderStyle(width: number | null, height: number | null): string | undefined {
	if (!width || !height) {
		return undefined;
	}

	return [
		`width:min(100%,${width}px)`,
		`max-width:${width}px`,
		`aspect-ratio:${width}/${height}`,
	].join(';');
}

function wrapWithImagePlaceholder(node: Element): Element {
	const properties = getProperties(node);
	const width = parseNumericDimension(properties.width);
	const height = parseNumericDimension(properties.height);
	const style = createPlaceholderStyle(width, height);

	return {
		type: 'element',
		tagName: 'span',
		properties: {
			className: ['img-placeholder-wrapper'],
			...(style ? { style } : {}),
		},
		children: [
			{
				type: 'element',
				tagName: 'span',
				properties: { className: ['spinner', 'img-spinner'], 'aria-hidden': 'true' },
				children: [],
			},
			node,
		],
	};
}

interface RehypeDocLinksOptions {
	docsGraphPath: string;
	siteBasePath: string;
	assetsPublicPath: string;
}

let cachedGraphContext: DocsGraphContext | null = null;
let cachedGraphMtimeMs = -1;

function loadGraphContext(docsGraphPath: string): DocsGraphContext {
	if (!existsSync(docsGraphPath)) {
		throw new Error(
			`Missing docs graph at ${docsGraphPath}. Start dev/build so docs generation plugin can run.`,
		);
	}

	const mtimeMs = statSync(docsGraphPath).mtimeMs;
	if (cachedGraphContext && mtimeMs === cachedGraphMtimeMs) {
		return cachedGraphContext;
	}

	const docsGraph = JSON.parse(readFileSync(docsGraphPath, 'utf-8')) as DocsGraphConfig;
	const sourceToRoute = Object.fromEntries(
		docsGraph.docs.map((doc) => [doc.sourcePath, doc.routePath]),
	);
	const filePathToSourcePath = Object.fromEntries(
		docsGraph.docs.flatMap((doc) => [
			[doc.sourcePath, doc.sourcePath],
			[`docs/${doc.sourcePath}`, doc.sourcePath],
			[doc.workspacePath, doc.sourcePath],
			[doc.workspaceRealPath, doc.sourcePath],
		]),
	);
	const context: DocsGraphContext = {
		sourceToRoute,
		filePathToSourcePath,
		assetPathSet: new Set(docsGraph.assets),
		assetMetadataByPath: docsGraph.assetMetadata ?? {},
	};

	cachedGraphContext = context;
	cachedGraphMtimeMs = mtimeMs;
	return context;
}

export function rehypeDocLinks({
	docsGraphPath,
	siteBasePath,
	assetsPublicPath,
}: RehypeDocLinksOptions): (tree: HastRoot, vfile: VFile) => void {
	return (tree: HastRoot, vfile: VFile) => {
		const { sourceToRoute, filePathToSourcePath, assetPathSet, assetMetadataByPath } =
			loadGraphContext(docsGraphPath);
		const fileMeta = vfile as VFile & { filename?: string; path?: string };
		const filePath = fileMeta.filename || fileMeta.path || fileMeta.history?.[0];
		if (!filePath) {
			return;
		}

		const sourcePath = inferSourcePath(filePath, filePathToSourcePath);
		if (!sourcePath || !sourceToRoute[sourcePath]) {
			return;
		}

		visit(tree, 'element', (node: Element, index, parent) => {
			if (node.tagName === 'a') {
				const properties = getProperties(node);
				const href = properties.href;
				if (typeof href === 'string') {
					const parsed = parseMarkdownDocHref(href);
					if (parsed) {
						const resolvedSourcePath = resolveDocRelativePath(sourcePath, parsed.targetPath);
						const routePath = sourceToRoute[resolvedSourcePath];
						if (!routePath) {
							throw new Error(
								`Unresolved markdown link '${href}' in '${sourcePath}' (resolved '${resolvedSourcePath}')`,
							);
						}

						const routeWithBase = withBasePath(routePath, siteBasePath);
						properties.href = withQueryAndHash(routeWithBase, parsed.query, parsed.hash);
					}
				}
				return;
			}

			if (node.tagName !== 'img') {
				return;
			}

			const properties = getProperties(node);
			const src = properties.src;
			if (typeof src !== 'string') {
				return;
			}

			let metadataAssetPath: string | null = null;
			const parsedAsset = parseLocalAssetHref(src);
			if (parsedAsset) {
				const resolvedAssetPath = resolveDocRelativePath(sourcePath, parsedAsset.targetPath);
				if (assetPathSet.has(resolvedAssetPath)) {
					metadataAssetPath = resolvedAssetPath;
					const normalizedAssetsPath = assetsPublicPath.replace(/\/+$/, '');
					const assetUrl = `${normalizedAssetsPath}/${resolvedAssetPath}`;
					const assetWithBase = withBasePath(assetUrl, siteBasePath);
					properties.src = withQueryAndHash(assetWithBase, parsedAsset.query, parsedAsset.hash);
				} else if (resolvedAssetPath.startsWith('assets/')) {
					const staticAssetPath = withBasePath(`/${resolvedAssetPath}`, siteBasePath);
					properties.src = withQueryAndHash(staticAssetPath, parsedAsset.query, parsedAsset.hash);
				} else {
					throw new Error(
						`Unresolved image link '${src}' in '${sourcePath}' (resolved '${resolvedAssetPath}')`,
					);
				}
			}

			if (metadataAssetPath) {
				const metadata = assetMetadataByPath[metadataAssetPath];
				if (metadata) {
					properties.width ??= metadata.width;
					properties.height ??= metadata.height;
				}
			}

			properties.loading ??= 'lazy';
			properties.decoding ??= 'async';

			const parentNode = parent as Parent | undefined;
			if (!parentNode || typeof index !== 'number') {
				return;
			}

			const parentElement = parentNode as Element;
			if (parentElement.type === 'element' && parentElement.tagName === 'picture') {
				return;
			}

			if (!Array.isArray(parentNode.children)) {
				return;
			}

			parentNode.children[index] = wrapWithImagePlaceholder(node);
		});
	};
}
