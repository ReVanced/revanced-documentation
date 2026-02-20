<script lang="ts">
    import { page } from '$app/state';
    import { SITE_NAME, LOGO_ASSET_PATH } from '../config';
    import Separator from '../components/Separator.svelte';
    import SidebarPageAnchors from './SidebarPageAnchors.svelte';
    import SidebarNavList from './SidebarNavList.svelte';
    import type { ClientDocsSection } from '../core/types';
    import { getClientDocsNavigation } from '../core/navigation';
    import IconClose from '~icons/mdi/close';
    import { normalizePathname, resolveRoutePath } from '../utils/paths';

    interface Props {
        onClose?: () => void;
    }

    let { onClose }: Props = $props();

    const docsNavigation: ClientDocsSection[] = getClientDocsNavigation();
    let pageAnchorSections = $derived(docsNavigation.filter(section => section.isPageAnchor));
    let regularNavSections = $derived(docsNavigation.filter(section => !section.isPageAnchor));

    let currentPath = $derived(normalizePathname(page.url.pathname));
    let activeSectionId = $derived(getActiveSectionId(currentPath, docsNavigation));

    let activePageAnchorSection = $derived.by(() => {
        const section = pageAnchorSections.find(s => s.id === activeSectionId);
        return section ?? null;
    });

    function getActiveSectionId(pathname: string, sections: ClientDocsSection[]): string | null {
        if (pathname === '/') return '_root';

        for (const section of sections) {
            if (!section.basePath) continue;
            if (pathname === `/${section.basePath}` || pathname.startsWith(`/${section.basePath}/`)) {
                return section.id;
            }
        }

        for (const section of sections) {
            if (section.basePath) continue;
            for (const page of section.pages) {
                if (pathname === page.routePath || pathname.startsWith(`${page.routePath}/`)) {
                    return section.id;
                }
            }
        }

        return null;
    }
</script>

<aside class="docs-sidebar">
    <div class="sidebar-header">
        <a href={resolveRoutePath('/')} class="sidebar-header-link">
            <img class="sidebar-logo" src={resolveRoutePath(LOGO_ASSET_PATH)} alt={`${SITE_NAME} logo`} />
            <span class="sidebar-title">{SITE_NAME}</span>
        </a>
        {#if onClose}
            <button class="sidebar-close-btn" onclick={onClose} aria-label="Close navigation">
                <IconClose width="24" height="24" />
            </button>
        {/if}
    </div>

    <nav class="sidebar-nav">
        <SidebarPageAnchors sections={pageAnchorSections} {activeSectionId} />
        <Separator />
        <SidebarNavList
            activeSection={activePageAnchorSection}
            regularSections={regularNavSections}
            {currentPath}
        />
    </nav>
</aside>

<style lang="scss">
    .docs-sidebar {
        width: 280px;
        min-width: 280px;
        height: 100vh;
        position: sticky;
        top: 0;
        padding: 16px;
        padding-top: 0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
        z-index: 50;
        background-color: var(--background-one);
    }

    .sidebar-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 4px;
        height: 56px;
        min-height: 56px;
        flex-shrink: 0;
    }

    .sidebar-header-link {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        color: inherit;
        flex: 1;

        &:hover .sidebar-title {
            color: var(--primary);
        }
    }

    .sidebar-close-btn {
        display: none;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        padding: 0;
        background: none;
        border: none;
        border-radius: 8px;
        color: var(--text-ee);
        cursor: pointer;

        &:hover {
            background-color: var(--tertiary);
            color: var(--text-one);
        }

        @media (max-width: 768px) {
            display: flex;
        }
    }

    .sidebar-logo {
        height: 22px;
        width: auto;
        flex-shrink: 0;
    }

    .sidebar-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-one);
        transition: none;
    }

    .sidebar-nav {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
</style>
