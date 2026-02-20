import path from 'node:path';

export interface ParsedDocHref {
	fullHref: string;
	targetPath: string;
	hash: string;
	query: string;
}

export function normalizePath(value: string): string {
	return value.replace(/\\/g, '/');
}

export function splitHref(href: string): { pathname: string; query: string; hash: string } {
	let pathname = href;
	let query = '';
	let hash = '';

	const hashIndex = pathname.indexOf('#');
	if (hashIndex >= 0) {
		hash = pathname.slice(hashIndex + 1);
		pathname = pathname.slice(0, hashIndex);
	}

	const queryIndex = pathname.indexOf('?');
	if (queryIndex >= 0) {
		query = pathname.slice(queryIndex + 1);
		pathname = pathname.slice(0, queryIndex);
	}

	return { pathname, query, hash };
}

export function isExternalHref(href: string): boolean {
	if (href.startsWith('//')) return true;
	try {
		const parsed = new URL(href);
		return parsed.protocol.length > 0;
	} catch {
		return false;
	}
}

export function parseMarkdownDocHref(href: string): ParsedDocHref | null {
	if (href.startsWith('#') || isExternalHref(href)) {
		return null;
	}

	const { pathname, query, hash } = splitHref(href);
	if (!pathname) {
		return null;
	}

	const extension = path.posix.extname(pathname).toLowerCase();
	if (extension && extension !== '.md') {
		return null;
	}

	let targetPath = pathname;
	if (!extension) {
		targetPath = pathname.endsWith('/') ? `${pathname}README.md` : `${pathname}.md`;
	}

	return {
		fullHref: href,
		targetPath,
		query,
		hash,
	};
}

export function parseLocalAssetHref(href: string): ParsedDocHref | null {
	if (href.startsWith('#') || href.startsWith('/') || isExternalHref(href)) {
		return null;
	}

	const { pathname, query, hash } = splitHref(href);
	if (!pathname || pathname.toLowerCase().endsWith('.md')) {
		return null;
	}

	return {
		fullHref: href,
		targetPath: pathname,
		query,
		hash,
	};
}

export function resolveDocRelativePath(currentSourcePath: string, targetPath: string): string {
	const currentDir = path.posix.dirname(currentSourcePath);
	const normalized = targetPath.startsWith('/')
		? path.posix.normalize(targetPath.slice(1))
		: path.posix.normalize(path.posix.join(currentDir, targetPath));

	if (normalized.startsWith('../') || normalized === '..') {
		throw new Error(`Relative path escapes docs root: ${targetPath}`);
	}

	return normalized;
}

export function withQueryAndHash(pathname: string, query: string, hash: string): string {
	const queryPart = query ? `?${query}` : '';
	const hashPart = hash ? `#${hash}` : '';
	return `${pathname}${queryPart}${hashPart}`;
}
