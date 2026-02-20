import {
	existsSync,
	mkdirSync,
	readFileSync,
	realpathSync,
	statSync,
	writeFileSync,
} from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';
import type { Heading, Image, Link, Root, RootContent } from 'mdast';
import { toString as mdastToString } from 'mdast-util-to-string';
import MiniSearch from 'minisearch';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import sharp from 'sharp';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import {
	DOCS_DIR,
	DOCS_SECTIONS,
	GITHUB_EDIT_BASE_URL,
	HEADER_BUTTONS,
	LOGO_ASSET_PATH,
	ORG_NAME,
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_THEME_COLOR,
	SITE_TITLE,
	SITE_URL,
} from '../site.config.js';
import {
	type ParsedDocHref,
	parseLocalAssetHref,
	parseMarkdownDocHref,
	resolveDocRelativePath,
} from '../src/lib/core/href-utils';
import type {
	DocNode,
	DocsGraph,
	SearchSection,
	SectionNode,
	TableOfContentsHeading,
} from '../src/lib/core/types';

const SEARCH_SETTINGS = {
	fuzzy: 0.15,
	prefix: true,
	combineWith: 'AND' as const,
	snippetMaxLength: 140,
	snippetContextChars: 40,
	ellipsis: '...',
	highlightTag: 'mark',
	maxIndexTextLength: 600,
};

const GENERATED_DIR = '.svelte-kit/generated';
const DOCS_GRAPH_PATH = `${GENERATED_DIR}/docs-graph.json`;
const DOCS_RUNTIME_GRAPH_PATH = `${GENERATED_DIR}/docs-runtime-graph.json`;
const SEARCH_INDEX_PATH = `${GENERATED_DIR}/search-index.json`;
const SITE_PUBLIC_CONFIG_PATH = `${GENERATED_DIR}/site-public.json`;
const ROOT_SECTION_ID = '_root';

interface SearchDoc {
	id: number;
	title: string;
	section: string;
	sectionId: string;
	sectionIcon: string;
	url: string;
	anchor: string;
	text: string;
}

interface TempDocNode {
	doc: DocNode;
	parsedLinks: ParsedDocHref[];
	parsedAssets: ParsedDocHref[];
	headingAnchors: Set<string>;
}

interface ValidationReporter {
	report: (message: string) => void;
	assertNoIssues: () => void;
}

interface FrontmatterInput {
	title?: unknown;
	description?: unknown;
	sidebar?: unknown;
	sidebar_label?: unknown;
	sidebar_position?: unknown;
	sidebar_order?: unknown;
	slug?: unknown;
}

function hasOwnSection(sectionId: string): boolean {
	return Object.hasOwn(DOCS_SECTIONS, sectionId);
}

function resolveSectionId(dirName: string): string {
	return dirName !== ROOT_SECTION_ID && hasOwnSection(dirName) ? dirName : ROOT_SECTION_ID;
}

function getSectionConfig(sectionId: string) {
	const section = DOCS_SECTIONS[sectionId as keyof typeof DOCS_SECTIONS];
	invariant(Boolean(section), `Missing section definition for '${sectionId}'`);
	return section;
}

function compareSectionOrder(a: string, b: string): number {
	return getSectionConfig(a).order - getSectionConfig(b).order;
}

const parseProcessor = unified().use(remarkParse).use(remarkGfm).use(remarkFrontmatter, ['yaml']);

function invariant(condition: boolean, message: string): asserts condition {
	if (!condition) throw new Error(message);
}

function isInsideDirectory(root: string, candidate: string): boolean {
	const relative = path.relative(root, candidate);
	return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function resolveAndAssertWorkspacePath(cwd: string, absolutePath: string): string {
	const resolvedPath = realpathSync(absolutePath);
	invariant(
		isInsideDirectory(cwd, resolvedPath),
		`Resolved path points outside workspace: ${absolutePath} -> ${resolvedPath}`,
	);
	return resolvedPath;
}

async function readImageMetadata(
	absolutePath: string,
): Promise<{ width: number; height: number } | null> {
	try {
		const metadata = await sharp(absolutePath).metadata();
		if (
			typeof metadata.width === 'number' &&
			typeof metadata.height === 'number' &&
			metadata.width > 0 &&
			metadata.height > 0
		) {
			return {
				width: metadata.width,
				height: metadata.height,
			};
		}
	} catch (error) {
		if (process.env.DEBUG_DOCS_GRAPH === '1') {
			console.warn(
				`[docs-graph] Failed to read image metadata for '${absolutePath}':`,
				error instanceof Error ? error.message : String(error),
			);
		}
	}

	return null;
}

function normalizeToPosix(filePath: string): string {
	return filePath.replace(/\\/g, '/');
}

function stripMarkdownExtension(filePath: string): string {
	return filePath.replace(/\.md$/i, '');
}

function slugify(value: string): string {
	return value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^\p{L}\p{N}\s_-]/gu, '')
		.trim()
		.toLowerCase()
		.replace(/[_\s]+/g, '-')
		.replace(/-{2,}/g, '-')
		.replace(/^-|-$/g, '');
}

function slugifyPath(value: string, sourcePath: string): string {
	const normalized = value.replace(/^\/+|\/+$/g, '');
	invariant(normalized.length > 0, `Invalid empty slug override in '${sourcePath}'`);

	const segments = normalized.split('/').filter(Boolean);
	const slugSegments: string[] = [];
	for (const segment of segments) {
		const slugged = slugify(segment);
		invariant(
			slugged.length > 0,
			`Slug segment '${segment}' in '${sourcePath}' produced an empty slug (contains only special characters or emoji)`,
		);
		slugSegments.push(slugged);
	}

	const slug = slugSegments.join('/');
	invariant(slug.length > 0, `Invalid slug generated from '${value}' in '${sourcePath}'`);
	return slug;
}

function titleCase(value: string): string {
	return value.replace(/[_-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function walkMarkdown(dir: string): string[] {
	if (!existsSync(dir)) return [];
	return fg
		.sync('**/*.md', {
			cwd: dir,
			absolute: true,
			onlyFiles: true,
			followSymbolicLinks: true,
		})
		.sort((a, b) => a.localeCompare(b));
}

function walkAssets(dir: string): string[] {
	if (!existsSync(dir)) return [];
	return fg
		.sync('**/*', {
			cwd: dir,
			absolute: true,
			onlyFiles: true,
			followSymbolicLinks: true,
			ignore: ['**/*.md'],
		})
		.sort((a, b) => a.localeCompare(b));
}

function toPlainText(root: Root): string {
	return mdastToString(root).replace(/\s+/g, ' ').trim();
}

function deriveDocLocation(
	sourcePath: string,
	slugOverride: string | null,
): {
	sectionId: string;
	contentSlug: string;
	slug: string;
	routePath: string;
	category: string;
} {
	const withoutExt = stripMarkdownExtension(sourcePath);
	const parts = withoutExt.split('/').filter(Boolean);
	invariant(parts.length > 0, `Invalid docs path: ${sourcePath}`);

	let sectionId = ROOT_SECTION_ID;
	let contentSlug: string;
	let category = '';

	if (parts.length === 1) {
		contentSlug = parts[0];
	} else {
		const topLevelDir = parts[0];
		sectionId = resolveSectionId(topLevelDir);

		if (sectionId === ROOT_SECTION_ID) {
			contentSlug = parts.join('/');
			category = topLevelDir;
		} else {
			contentSlug = parts.slice(1).join('/');
			category = parts.length === 2 ? '' : parts.slice(1, -1).join(' / ');
		}
	}

	const slugSource = slugOverride ?? contentSlug;
	const slug = slugifyPath(slugSource, sourcePath);
	const routePath = sectionId === ROOT_SECTION_ID ? `/${slug}` : `/${sectionId}/${slug}`;

	return {
		sectionId,
		contentSlug,
		slug,
		routePath,
		category,
	};
}

function extractFrontmatter(
	raw: string,
	sourcePath: string,
): {
	body: string;
	title: string | null;
	sidebarLabel: string | null;
	sidebarOrder: number | null;
	description: string | null;
	slug: string | null;
} {
	const parsed = matter(raw);
	const data = (parsed.data ?? {}) as FrontmatterInput;

	const sidebar =
		data.sidebar && typeof data.sidebar === 'object'
			? (data.sidebar as Record<string, unknown>)
			: null;

	const title = typeof data.title === 'string' ? data.title.trim() : null;
	const sidebarLabel =
		(typeof sidebar?.label === 'string'
			? sidebar.label
			: typeof data.sidebar_label === 'string'
				? data.sidebar_label
				: null
		)?.trim() ?? null;
	const description = typeof data.description === 'string' ? data.description.trim() : null;
	const slug = typeof data.slug === 'string' ? data.slug.trim() : null;

	let sidebarOrder: number | null = null;
	const sidebarOrderRaw = sidebar?.order ?? data.sidebar_position ?? data.sidebar_order;
	if (typeof sidebarOrderRaw === 'number' && Number.isFinite(sidebarOrderRaw)) {
		sidebarOrder = sidebarOrderRaw;
	} else if (typeof sidebarOrderRaw === 'string' && sidebarOrderRaw.trim() !== '') {
		const numeric = Number(sidebarOrderRaw);
		if (!Number.isFinite(numeric)) {
			throw new Error(
				`Invalid sidebar order in ${sourcePath}: expected a number, got ${JSON.stringify(sidebarOrderRaw)}`,
			);
		}
		sidebarOrder = numeric;
	}

	return {
		body: parsed.content,
		title,
		sidebarLabel,
		sidebarOrder,
		description,
		slug,
	};
}

function headingText(heading: Heading): string {
	return mdastToString(heading).replace(/\s+/g, ' ').trim();
}

function headingSlugText(heading: Heading): string {
	return mdastToString(heading);
}

function extractHeadingsAndSections(
	root: Root,
	sourcePath: string,
): {
	headings: TableOfContentsHeading[];
	searchSections: SearchSection[];
	headingAnchors: string[];
} {
	const slugger = new GithubSlugger();
	const headings: TableOfContentsHeading[] = [];
	const headingIds = new Set<string>();

	const searchSections: SearchSection[] = [];
	let currentHeading = '';
	let currentAnchor = '';
	let currentNodes: RootContent[] = [];

	const flush = () => {
		if (currentNodes.length === 0 && currentHeading === '') return;

		const sectionRoot: Root = { type: 'root', children: currentNodes };
		const text = toPlainText(sectionRoot);
		if (text) {
			searchSections.push({
				heading: currentHeading,
				anchor: currentAnchor,
				text,
			});
		}
	};

	for (const node of root.children) {
		if (node.type === 'heading') {
			flush();

			const title = headingText(node);
			const id = slugger.slug(headingSlugText(node));
			invariant(!headingIds.has(id), `Duplicate heading id '${id}' detected in '${sourcePath}'`);
			headingIds.add(id);

			if (node.depth >= 2 && node.depth <= 6) {
				headings.push({
					id,
					title,
					level: node.depth,
				});
			}

			currentHeading = title;
			currentAnchor = id;
			currentNodes = [];
			continue;
		}

		currentNodes.push(node);
	}

	flush();

	return { headings, searchSections, headingAnchors: [...headingIds] };
}

function extractInternalLinks(root: Root): ParsedDocHref[] {
	const links: ParsedDocHref[] = [];
	visit(root, 'link', (node) => {
		const link = node as Link;
		if (typeof link.url !== 'string') return;

		const parsed = parseMarkdownDocHref(link.url);
		if (parsed) links.push(parsed);
	});

	return links;
}

function extractInternalAssets(root: Root): ParsedDocHref[] {
	const assets: ParsedDocHref[] = [];
	visit(root, 'image', (node) => {
		const image = node as Image;
		if (typeof image.url !== 'string') return;

		const parsed = parseLocalAssetHref(image.url);
		if (parsed) assets.push(parsed);
	});

	return assets;
}

function buildEditUrl(sectionId: string, sourcePath: string): string {
	const section = getSectionConfig(sectionId);
	const repo = section.repo;
	if (sectionId === ROOT_SECTION_ID) {
		return `${GITHUB_EDIT_BASE_URL}/${repo.name}/edit/${repo.branch}/${repo.docsPath}/${sourcePath}`;
	}

	invariant(
		sourcePath.startsWith(`${sectionId}/`),
		`Source path '${sourcePath}' does not match section prefix '${sectionId}/'`,
	);
	const repoRelativePath = sourcePath.slice(sectionId.length + 1);
	return `${GITHUB_EDIT_BASE_URL}/${repo.name}/edit/${repo.branch}/${repo.docsPath}/${repoRelativePath}`;
}

function extractPrimaryTitle(root: Root): string | null {
	for (const node of root.children) {
		if (node.type === 'heading' && node.depth === 1) {
			const title = headingText(node);
			if (title) return title;
		}
	}
	return null;
}

function decodeAnchor(hash: string): string {
	try {
		return decodeURIComponent(hash);
	} catch {
		return hash;
	}
}

async function collectAssets(
	cwd: string,
	docsDir: string,
): Promise<{ knownAssetPaths: Set<string>; assetMetadata: DocsGraph['assetMetadata'] }> {
	const assetFiles = walkAssets(docsDir);
	const knownAssetPaths = new Set<string>();
	const assetMetadata: DocsGraph['assetMetadata'] = {};

	await Promise.all(
		assetFiles.map(async (filePath) => {
			const workspaceRealPath = resolveAndAssertWorkspacePath(cwd, filePath);
			const sourcePath = normalizeToPosix(path.relative(docsDir, filePath));
			knownAssetPaths.add(sourcePath);
			const metadata = await readImageMetadata(workspaceRealPath);
			if (metadata) {
				assetMetadata[sourcePath] = metadata;
			}
		}),
	);

	return { knownAssetPaths, assetMetadata };
}

function parseMarkdownFiles(cwd: string, docsDir: string): TempDocNode[] {
	const markdownFiles = walkMarkdown(docsDir);
	const temporaryDocs: TempDocNode[] = [];
	const routeToSource = new Map<string, string>();
	const sourceToRoute = new Map<string, string>();

	for (const filePath of markdownFiles) {
		const workspaceRealFilePath = resolveAndAssertWorkspacePath(cwd, filePath);
		const rawFile = readFileSync(filePath, 'utf-8');
		const relativePath = normalizeToPosix(path.relative(docsDir, filePath));
		const workspacePath = normalizeToPosix(path.relative(cwd, filePath));
		const workspaceRealPath = normalizeToPosix(path.relative(cwd, workspaceRealFilePath));

		const frontmatter = extractFrontmatter(rawFile, relativePath);
		const { sectionId, contentSlug, slug, routePath, category } = deriveDocLocation(
			relativePath,
			frontmatter.slug,
		);
		const root = parseProcessor.parse(frontmatter.body) as Root;
		const extracted = extractHeadingsAndSections(root, relativePath);

		const sourceWithoutExt = stripMarkdownExtension(relativePath);
		const fileName = path.basename(sourceWithoutExt);
		const pageTitle = frontmatter.title ?? extractPrimaryTitle(root) ?? titleCase(fileName);
		const sidebarLabel = frontmatter.sidebarLabel ?? pageTitle;

		const routeConflict = routeToSource.get(routePath);
		invariant(
			!routeConflict,
			`Duplicate route path '${routePath}' for '${relativePath}' and '${routeConflict}'`,
		);
		routeToSource.set(routePath, relativePath);

		const sourceConflict = sourceToRoute.get(relativePath);
		invariant(!sourceConflict, `Duplicate source path '${relativePath}'`);
		sourceToRoute.set(relativePath, routePath);

		temporaryDocs.push({
			doc: {
				sourcePath: relativePath,
				workspacePath,
				workspaceRealPath,
				sectionId,
				sectionTitle: getSectionConfig(sectionId).label,
				contentSlug,
				slug,
				routePath,
				category,
				title: pageTitle,
				sidebarLabel,
				sidebarOrder: frontmatter.sidebarOrder,
				description: frontmatter.description,
				headings: extracted.headings,
				searchSections: extracted.searchSections,
				plainText: toPlainText(root),
				editUrl: buildEditUrl(sectionId, relativePath),
			},
			parsedLinks: extractInternalLinks(root),
			parsedAssets: extractInternalAssets(root),
			headingAnchors: new Set(extracted.headingAnchors),
		});
	}

	return temporaryDocs;
}

function createValidationReporter(): ValidationReporter {
	const issues: string[] = [];
	return {
		report(message: string) {
			issues.push(message);
		},
		assertNoIssues() {
			if (issues.length === 0) {
				return;
			}
			throw new Error(issues.join('\n'));
		},
	};
}

function validateReferences(
	temporaryDocs: TempDocNode[],
	knownAssetPaths: Set<string>,
	reporter: ValidationReporter,
): void {
	const docsBySourcePath = new Map<string, TempDocNode>(
		temporaryDocs.map((tempDoc) => [tempDoc.doc.sourcePath, tempDoc]),
	);

	for (const tempDoc of temporaryDocs) {
		for (const link of tempDoc.parsedLinks) {
			let resolvedSourcePath: string;
			try {
				resolvedSourcePath = resolveDocRelativePath(tempDoc.doc.sourcePath, link.targetPath);
			} catch (error) {
				reporter.report(
					`Invalid markdown link in '${tempDoc.doc.sourcePath}': '${link.fullHref}' (${error instanceof Error ? error.message : String(error)})`,
				);
				continue;
			}

			const targetDoc = docsBySourcePath.get(resolvedSourcePath);
			if (!targetDoc) {
				reporter.report(
					`Unresolved markdown link in '${tempDoc.doc.sourcePath}': '${link.fullHref}' resolves to '${resolvedSourcePath}'`,
				);
				continue;
			}

			if (link.hash) {
				const targetAnchor = decodeAnchor(link.hash);
				if (!targetDoc.headingAnchors.has(targetAnchor)) {
					reporter.report(
						`Unresolved markdown anchor in '${tempDoc.doc.sourcePath}': '${link.fullHref}' points to missing '#${targetAnchor}' in '${resolvedSourcePath}'`,
					);
				}
			}
		}

		for (const asset of tempDoc.parsedAssets) {
			let resolvedAssetPath: string;
			try {
				resolvedAssetPath = resolveDocRelativePath(tempDoc.doc.sourcePath, asset.targetPath);
			} catch (error) {
				reporter.report(
					`Invalid image link in '${tempDoc.doc.sourcePath}': '${asset.fullHref}' (${error instanceof Error ? error.message : String(error)})`,
				);
				continue;
			}

			if (!knownAssetPaths.has(resolvedAssetPath)) {
				reporter.report(
					`Unresolved image link in '${tempDoc.doc.sourcePath}': '${asset.fullHref}' resolves to '${resolvedAssetPath}'`,
				);
			}
		}
	}
}

function organizeSections(temporaryDocs: TempDocNode[]): {
	docs: DocNode[];
	sections: SectionNode[];
} {
	const docsBySection = new Map<string, DocNode[]>();
	for (const tempDoc of temporaryDocs) {
		const sectionDocs = docsBySection.get(tempDoc.doc.sectionId);
		if (sectionDocs) {
			sectionDocs.push(tempDoc.doc);
			continue;
		}
		docsBySection.set(tempDoc.doc.sectionId, [tempDoc.doc]);
	}

	const orderedSectionIds = Object.keys(DOCS_SECTIONS)
		.filter((sectionId) => docsBySection.has(sectionId))
		.sort(compareSectionOrder);

	const docs: DocNode[] = [];
	const sections: SectionNode[] = [];

	for (const sectionId of orderedSectionIds) {
		const sectionDocs = docsBySection.get(sectionId);
		invariant(sectionDocs !== undefined, `Missing section docs for '${sectionId}'`);
		sectionDocs.sort((a, b) => {
			const aOrder = a.sidebarOrder ?? Number.POSITIVE_INFINITY;
			const bOrder = b.sidebarOrder ?? Number.POSITIVE_INFINITY;
			if (aOrder !== bOrder) return aOrder - bOrder;
			return a.routePath.localeCompare(b.routePath);
		});

		docs.push(...sectionDocs);

		const sectionDef = getSectionConfig(sectionId);
		sections.push({
			id: sectionId,
			title: sectionDef.label,
			order: sectionDef.order,
			basePath: sectionId === ROOT_SECTION_ID ? '' : sectionId,
			isPageAnchor: sectionId !== ROOT_SECTION_ID,
			icon: sectionDef.icon,
			pages: sectionDocs.map((doc) => doc.routePath),
		});
	}

	return { docs, sections };
}

async function buildDocsGraph(cwd = process.cwd()): Promise<DocsGraph> {
	const docsDir = path.join(cwd, DOCS_DIR);

	const [{ knownAssetPaths, assetMetadata }, temporaryDocs] = await Promise.all([
		collectAssets(cwd, docsDir),
		Promise.resolve(parseMarkdownFiles(cwd, docsDir)),
	]);

	const reporter = createValidationReporter();
	validateReferences(temporaryDocs, knownAssetPaths, reporter);
	reporter.assertNoIssues();

	const { docs, sections } = organizeSections(temporaryDocs);

	return {
		generatedAt: new Date().toISOString(),
		docs,
		sections,
		assets: [...knownAssetPaths].sort((a, b) => a.localeCompare(b)),
		assetMetadata,
	};
}

const cwd = process.cwd();
const graphOutputPath = path.join(cwd, DOCS_GRAPH_PATH);
const runtimeGraphOutputPath = path.join(cwd, DOCS_RUNTIME_GRAPH_PATH);
const searchIndexOutputPath = path.join(cwd, SEARCH_INDEX_PATH);
const sitePublicConfigOutputPath = path.join(cwd, SITE_PUBLIC_CONFIG_PATH);
const docsDir = path.join(cwd, DOCS_DIR);
const repoAssetsDir = path.join(cwd, 'assets');
const configPath = path.resolve(cwd, 'site.config.ts');
const force = process.argv.includes('--force');

const outputFiles = [
	graphOutputPath,
	runtimeGraphOutputPath,
	searchIndexOutputPath,
	sitePublicConfigOutputPath,
];

function assertInsideWorkspace(targetPath: string): void {
	const relative = path.relative(cwd, targetPath);
	if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) {
		return;
	}
	throw new Error(`Refusing to write outside workspace: ${targetPath}`);
}

function writeJsonFile(outputPath: string, value: unknown): void {
	assertInsideWorkspace(outputPath);
	mkdirSync(path.dirname(outputPath), { recursive: true });
	writeFileSync(outputPath, `${JSON.stringify(value, null, 2)}\n`, 'utf-8');
}

function getLatestMtimeMs(paths: string[]): number {
	let latest = 0;
	for (const filePath of paths) {
		if (!existsSync(filePath)) {
			continue;
		}
		const mtimeMs = statSync(filePath).mtimeMs;
		if (mtimeMs > latest) {
			latest = mtimeMs;
		}
	}
	return latest;
}

function toWorkspaceRealPath(absolutePath: string): string {
	const realPath = realpathSync(absolutePath);
	assertInsideWorkspace(realPath);
	return realPath;
}

function collectGenerationInputs(): string[] {
	const docsFiles = existsSync(docsDir)
		? fg.sync('**/*', {
				cwd: docsDir,
				absolute: true,
				onlyFiles: true,
				followSymbolicLinks: true,
			})
		: [];
	const docsDirectories = existsSync(docsDir)
		? [
				docsDir,
				...fg.sync('**/*', {
					cwd: docsDir,
					absolute: true,
					onlyDirectories: true,
					followSymbolicLinks: true,
				}),
			]
		: [];

	const repoAssetFiles = existsSync(repoAssetsDir)
		? fg.sync('**/*', {
				cwd: repoAssetsDir,
				absolute: true,
				onlyFiles: true,
				followSymbolicLinks: true,
			})
		: [];
	const repoAssetDirectories = existsSync(repoAssetsDir)
		? [
				repoAssetsDir,
				...fg.sync('**/*', {
					cwd: repoAssetsDir,
					absolute: true,
					onlyDirectories: true,
					followSymbolicLinks: true,
				}),
			]
		: [];

	const scriptFiles = [
		path.resolve(cwd, 'scripts/generate-docs-graph.ts'),
		path.resolve(cwd, 'scripts/build-llms.ts'),
		path.resolve(cwd, 'src/lib/core/href-utils.ts'),
		configPath,
	]
		.filter(existsSync)
		.map(toWorkspaceRealPath);

	return [
		...new Set([
			...docsFiles.map(toWorkspaceRealPath),
			...docsDirectories.map(toWorkspaceRealPath),
			...repoAssetFiles.map(toWorkspaceRealPath),
			...repoAssetDirectories.map(toWorkspaceRealPath),
			...scriptFiles,
		]),
	];
}

function isGenerationUpToDate(): boolean {
	for (const outputPath of outputFiles) {
		if (!existsSync(outputPath)) {
			return false;
		}
	}

	const inputs = collectGenerationInputs();
	if (inputs.length === 0) {
		return false;
	}

	const newestInput = getLatestMtimeMs(inputs);
	if (newestInput === 0) {
		return false;
	}

	const oldestOutput = Math.min(...outputFiles.map((outputPath) => statSync(outputPath).mtimeMs));
	return oldestOutput >= newestInput;
}

function buildSearchIndex(currentGraph: DocsGraph): string {
	const sectionIconMap = new Map(
		currentGraph.sections.map((section) => [section.id, section.icon]),
	);
	const docs: SearchDoc[] = [];
	let nextId = 1;

	for (const doc of currentGraph.docs) {
		const sectionIcon = sectionIconMap.get(doc.sectionId) ?? '';

		if (doc.searchSections.length === 0) {
			if (!doc.plainText) continue;
			docs.push({
				id: nextId++,
				title: doc.title,
				section: doc.sectionTitle,
				sectionId: doc.sectionId,
				sectionIcon,
				url: doc.routePath,
				anchor: '',
				text: doc.plainText.slice(0, SEARCH_SETTINGS.maxIndexTextLength),
			});
			continue;
		}

		for (const section of doc.searchSections) {
			docs.push({
				id: nextId++,
				title: section.heading || doc.title,
				section: `${doc.sectionTitle} › ${doc.title}`,
				sectionId: doc.sectionId,
				sectionIcon,
				url: doc.routePath,
				anchor: section.anchor,
				text: section.text.slice(0, SEARCH_SETTINGS.maxIndexTextLength),
			});
		}
	}

	const ms = new MiniSearch({
		fields: ['title', 'text', 'section'],
		storeFields: ['title', 'section', 'sectionId', 'sectionIcon', 'url', 'anchor', 'text'],
		searchOptions: {
			boost: { title: 4, section: 2, text: 1 },
			fuzzy: SEARCH_SETTINGS.fuzzy,
			prefix: SEARCH_SETTINGS.prefix,
			combineWith: SEARCH_SETTINGS.combineWith as 'AND' | 'OR' | 'AND_NOT',
		},
	});

	ms.addAll(docs);
	return JSON.stringify(ms);
}

function buildSitePublicConfig() {
	const sectionIcons = Object.fromEntries(
		Object.entries(DOCS_SECTIONS).map(([id, section]) => [id, { icon: section.icon }]),
	);

	return {
		site: {
			name: SITE_NAME,
			org: ORG_NAME,
			title: SITE_TITLE,
			description: SITE_DESCRIPTION,
			logoAssetPath: LOGO_ASSET_PATH,
			headerButtons: HEADER_BUTTONS,
			themeColor: SITE_THEME_COLOR,
		},
		sections: sectionIcons,
		siteUrl: SITE_URL,
	};
}

function buildRuntimeDocsGraph(currentGraph: DocsGraph) {
	return {
		generatedAt: currentGraph.generatedAt,
		docs: currentGraph.docs.map((doc) => ({
			sourcePath: doc.sourcePath,
			sectionId: doc.sectionId,
			sectionTitle: doc.sectionTitle,
			contentSlug: doc.contentSlug,
			slug: doc.slug,
			routePath: doc.routePath,
			category: doc.category,
			title: doc.title,
			sidebarLabel: doc.sidebarLabel,
			headings: doc.headings,
			editUrl: doc.editUrl,
		})),
		sections: currentGraph.sections,
	};
}

if (!force && isGenerationUpToDate()) {
	console.log('Docs artifacts are up to date');
	process.exit(0);
}

const graph = await buildDocsGraph(cwd);

writeJsonFile(graphOutputPath, graph);
writeJsonFile(runtimeGraphOutputPath, buildRuntimeDocsGraph(graph));
writeJsonFile(sitePublicConfigOutputPath, buildSitePublicConfig());
writeFileSync(searchIndexOutputPath, buildSearchIndex(graph), 'utf-8');
