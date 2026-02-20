import { base, resolve } from '$app/paths';

function stripTrailingSlash(pathname: string): string {
	if (pathname.length <= 1) {
		return pathname || '/';
	}
	return pathname.replace(/\/+$/, '');
}

function normalizedBasePath(): string {
	const rawBase = base || '/';
	const basePath = rawBase.startsWith('/') ? rawBase : `/${rawBase}`;
	return stripTrailingSlash(basePath);
}

export function normalizePathname(pathname: string): string {
	const normalizedPathname = stripTrailingSlash(pathname || '/');
	const normalizedRootHref = normalizedBasePath();

	if (normalizedRootHref === '/') {
		return normalizedPathname;
	}
	if (normalizedPathname === normalizedRootHref) {
		return '/';
	}
	if (normalizedPathname.startsWith(`${normalizedRootHref}/`)) {
		return normalizedPathname.slice(normalizedRootHref.length) || '/';
	}

	return normalizedPathname;
}

export function resolveRoutePath(routePath: string): string {
	return resolve(routePath as `/${string}`);
}
