<script lang="ts">
    import { page } from '$app/state';
    import Header from '$lib/layout/Header.svelte';
    import DocsSidebar from '$lib/layout/DocsSidebar.svelte';
    import DocsHeader from '$lib/layout/DocsHeader.svelte';
    import TableOfContents from '$lib/layout/TableOfContents.svelte';
    import PageNavigation from '$lib/layout/PageNavigation.svelte';
    import CopyCode from '$lib/components/CopyCode.svelte';
    import { SITE_TITLE, ORG_NAME } from '$lib/config';
    import { normalizePathname } from '$lib/utils/paths';
    import '../app.scss';

    let { children } = $props();

    let headings = $derived(
        (page.data.headings as { id: string; title: string; level: number }[] | undefined) ?? [],
    );
    let pageTitle = $derived(page.data?.title);

    let pathname = $derived(normalizePathname(page.url.pathname));
    let isDocPage = $derived(pathname !== '/');
    let hasToc = $derived(headings.length > 0 && isDocPage);

    const MOBILE_BREAKPOINT = 768;

    let sidebarOpen = $state(false);
    let savedScrollY = 0;

    function closeSidebar() { sidebarOpen = false; }
    function toggleSidebar() { sidebarOpen = !sidebarOpen; }

    $effect(() => { void page.url.pathname; closeSidebar(); });

    $effect(() => {
        if (typeof document === 'undefined') return;
        if (sidebarOpen) {
            savedScrollY = window.scrollY;
            Object.assign(document.body.style, { overflow: 'hidden', position: 'fixed', width: '100%', top: `-${savedScrollY}px` });
        } else {
            Object.assign(document.body.style, { overflow: '', position: '', width: '', top: '' });
            if (savedScrollY > 0) window.scrollTo(0, savedScrollY);
        }
    });

    $effect(() => {
        if (typeof window === 'undefined') return;
        const onResize = () => {
            if (window.innerWidth > MOBILE_BREAKPOINT) {
                sidebarOpen = false;
            }
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    });

</script>

<svelte:head>
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/>
    <meta name="author" content={ORG_NAME}/>
    <meta property="og:type" content="website"/>
    <meta property="og:site_name" content={SITE_TITLE}/>
    <meta property="og:locale" content="en_US"/>
</svelte:head>

<Header onMenuClick={toggleSidebar} menuOpen={sidebarOpen} tocItems={headings} showToc={isDocPage} />

<div class="docs-layout" class:has-toc-row={hasToc}>
    <div class="sidebar-wrapper" class:open={sidebarOpen}>
        <DocsSidebar onClose={closeSidebar} />
    </div>

    <main class="docs-main" class:has-toc={hasToc}>
        <CopyCode>
            <article class="docs-content">
            {#if isDocPage}
                <DocsHeader title={pageTitle} />
            {/if}
            <div class="markdown-content">
                {@render children()}
            </div>
            {#if isDocPage}
                <PageNavigation />
            {/if}
            </article>
        </CopyCode>
    </main>

    {#if hasToc}
        <aside class="docs-toc">
            <TableOfContents items={headings} selector=".docs-content" />
        </aside>
    {/if}
</div>

<style lang="scss">
    @use '../tokens' as *;

    $main-top: $header-height;
    $main-top-toc: calc(#{$header-height} + #{$toc-row-height});

    .docs-layout {
        display: flex;
        min-height: 100vh;
        width: 100%;
        --docs-anchor-offset: #{$anchor-offset};
    }

    .sidebar-wrapper {
        display: contents;
    }

    .docs-main {
        flex: 1;
        min-width: 0;
        background-color: rgba(255, 255, 255, 0.02);
        border-top-left-radius: $layout-radius;
        border-top-right-radius: $layout-radius;
        margin-top: $main-top;
        overflow: hidden;
    }

    .docs-content {
        max-width: $content-max-width;
        margin: 0 auto;
        padding: 48px 40px;
    }

    .docs-toc {
        width: $toc-width;
        min-width: $toc-width;
        padding: 24px 16px;
        margin-top: $main-top;
        position: sticky;
        top: $header-height;
        height: calc(100vh - #{$header-height});
        overflow-y: auto;
        z-index: $z-toc;
        background-color: var(--background-one);
        content-visibility: auto;
        contain-intrinsic-size: $toc-width 100vh;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    @media (max-width: $bp-desktop) {
        .docs-layout.has-toc-row {
            --docs-anchor-offset: calc(#{$main-top-toc} + 24px);
        }

        .docs-toc {
            display: none;
        }

        .docs-main,
        .docs-main.has-toc {
            margin-top: $main-top;
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
        }

        .has-toc-row .docs-main,
        .has-toc-row .docs-main.has-toc {
            margin-top: $main-top-toc;
        }
    }

    @media (max-width: $bp-mobile) {
        .docs-layout {
            flex-direction: column;
        }

        .sidebar-wrapper {
            display: none;
            position: fixed;
            top: $header-height;
            left: 0;
            width: 100%;
            height: calc(100vh - #{$header-height});
            z-index: $z-sidebar;
            background-color: var(--background-one);
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;

            &.open {
                display: block;
            }

            :global(.docs-sidebar) {
                display: flex;
                position: static;
                width: 100%;
                min-width: 0;
                height: auto;
                min-height: 0;
                padding: 24px 16px;
                padding-bottom: 80px;
                overflow: visible;
            }

            :global(.sidebar-header) {
                display: none;
            }
        }

        .docs-main,
        .docs-main.has-toc {
            margin-top: $main-top;
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
        }

        .has-toc-row .docs-main,
        .has-toc-row .docs-main.has-toc {
            margin-top: $main-top-toc;
        }

        .docs-content {
            padding: 24px 16px;
        }

        .docs-toc {
            display: none;
        }
    }
</style>
