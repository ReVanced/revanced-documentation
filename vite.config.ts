import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import fg from 'fast-glob';
import Icons from 'unplugin-icons/vite';
import { defineConfig, type Plugin } from 'vite';
import { DOCS_DIR } from './site.config.js';

const DOCS_ASSETS_PUBLIC_PATH = '/assets/docs';
const DOCS_GRAPH_PATH = '.svelte-kit/generated/docs-graph.json';
const SVELTEKIT_OUT_DIR = '.svelte-kit';

function docsArtifactsPlugin(): Plugin {
	const normalizedOutDir = SVELTEKIT_OUT_DIR.split('/')
		.join(path.sep)
		.replace(/[/\\]+$/, '');
	const generatedDirSegment = `${path.sep}${normalizedOutDir}${path.sep}generated${path.sep}`;
	let root = process.cwd();
	let generatedInitially = false;
	let generationInProgress = false;
	let pendingForceRun = false;
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	function shouldRegenerate(filePath: string): boolean {
		const normalized = path.normalize(filePath);
		if (normalized.includes(generatedDirSegment)) {
			return false;
		}

		const relative = path.relative(root, normalized);
		if (relative.startsWith('..')) {
			return false;
		}

		return (
			relative === 'site.config.ts' ||
			relative.startsWith(`docs${path.sep}`) ||
			relative.startsWith(`assets${path.sep}`) ||
			relative.startsWith(`src${path.sep}lib${path.sep}core${path.sep}`) ||
			relative.startsWith(`scripts${path.sep}`)
		);
	}

	function runGeneration(force: boolean): Promise<void> {
		const args = ['scripts/generate-docs-graph.ts'];
		if (force) {
			args.push('--force');
		}

		return new Promise((resolve, reject) => {
			const child = spawn('bun', args, {
				cwd: root,
				stdio: 'inherit',
				env: process.env,
			});

			child.on('error', reject);
			child.on('close', (code) => {
				if (code === 0) {
					resolve();
					return;
				}
				reject(new Error(`Docs generation failed with exit code ${code ?? 1}`));
			});
		});
	}

	async function triggerGeneration(
		force: boolean,
		onSuccess: () => void,
		onError: (error: unknown) => void,
	): Promise<void> {
		if (force) {
			pendingForceRun = true;
		}
		if (generationInProgress) {
			return;
		}

		generationInProgress = true;
		let shouldForce = force;
		while (true) {
			try {
				await runGeneration(shouldForce);
			} catch (error) {
				generationInProgress = false;
				onError(error);
				return;
			}
			if (!pendingForceRun) {
				break;
			}
			pendingForceRun = false;
			shouldForce = true;
		}

		generationInProgress = false;
		onSuccess();
	}

	/** Serve a file from `sourceDir` for requests under the given URL prefix (dev only). */
	function serveFromDir(sourceDir: string) {
		return (req: { url?: string }, res: { end: (data: Buffer) => void }, next: () => void) => {
			const url = req.url?.split('?')[0];
			if (!url) return next();
			const relativePath = decodeURIComponent(url).replace(/^\/+/, '');
			const filePath = path.join(sourceDir, relativePath);
			if (
				!filePath.startsWith(sourceDir) ||
				!existsSync(filePath) ||
				!statSync(filePath).isFile()
			) {
				return next();
			}
			res.end(readFileSync(filePath));
		};
	}

	return {
		name: 'docs-artifacts',
		configResolved(config) {
			root = config.root;
		},
		async buildStart() {
			if (generatedInitially) {
				return;
			}
			generatedInitially = true;
			await runGeneration(false);
		},
		configureServer(server) {
			root = server.config.root;

			const docsDir = path.resolve(root, DOCS_DIR);
			const repoAssetsDir = path.resolve(root, 'assets');

			server.middlewares.use(DOCS_ASSETS_PUBLIC_PATH, serveFromDir(docsDir));

			server.middlewares.use('/assets', serveFromDir(repoAssetsDir));

			const onFileChange = (filePath: string) => {
				if (!shouldRegenerate(filePath)) {
					return;
				}
				if (debounceTimer) {
					clearTimeout(debounceTimer);
				}
				debounceTimer = setTimeout(() => {
					void triggerGeneration(
						true,
						() => server.ws.send({ type: 'full-reload' }),
						(error) =>
							server.config.logger.error(error instanceof Error ? error.message : String(error)),
					);
				}, 120);
			};

			server.watcher.on('add', onFileChange);
			server.watcher.on('change', onFileChange);
			server.watcher.on('unlink', onFileChange);
		},
		generateBundle() {
			const docsDir = path.resolve(root, DOCS_DIR);
			const repoAssetsDir = path.resolve(root, 'assets');
			const graphPath = path.resolve(root, DOCS_GRAPH_PATH);

			if (existsSync(graphPath)) {
				const graph = JSON.parse(readFileSync(graphPath, 'utf-8'));
				const assets: string[] = graph.assets ?? [];
				for (const assetPath of assets) {
					const filePath = path.join(docsDir, assetPath);
					if (!existsSync(filePath)) {
						this.warn(`Doc asset not found: ${filePath} (referenced as '${assetPath}')`);
						continue;
					}
					this.emitFile({
						type: 'asset',
						fileName: `${DOCS_ASSETS_PUBLIC_PATH.replace(/^\//, '')}/${assetPath}`,
						source: readFileSync(filePath),
					});
				}
			}

			if (existsSync(repoAssetsDir)) {
				const repoAssets = fg.sync('**/*', {
					cwd: repoAssetsDir,
					onlyFiles: true,
					followSymbolicLinks: true,
				});
				for (const assetPath of repoAssets) {
					const filePath = path.join(repoAssetsDir, assetPath);
					this.emitFile({
						type: 'asset',
						fileName: `assets/${assetPath.replace(/\\/g, '/')}`,
						source: readFileSync(filePath),
					});
				}
			}
		},
	};
}

const workspaceRoot = path.resolve(process.cwd());
const docsRoot = path.resolve(workspaceRoot, 'docs');
const repoAssetsRoot = path.resolve(workspaceRoot, 'assets');

export default defineConfig({
	server: {
		fs: {
			allow: [workspaceRoot, docsRoot, repoAssetsRoot],
		},
	},
	plugins: [docsArtifactsPlugin(), Icons({ compiler: 'svelte' }), sveltekit()],
});
