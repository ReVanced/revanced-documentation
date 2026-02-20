<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import type { TableOfContentsItem } from '../core/types';
	import TableOfContents from './TableOfContents.svelte';
	import SearchBar from '../components/SearchBar.svelte';
	import IconMagnify from '~icons/mdi/magnify';
	import IconChevronDown from '~icons/mdi/chevron-down';
	import { SITE_NAME, HEADER_BUTTONS, LOGO_ASSET_PATH, getIconComponent } from '../config';
	import { resolveRoutePath } from '../utils/paths';

	interface Props {
		onMenuClick?: () => void;
		menuOpen?: boolean;
		tocItems?: TableOfContentsItem[];
		showToc?: boolean;
	}

	let { onMenuClick, menuOpen = false, tocItems = [], showToc = false }: Props = $props();

	let isScrolled = $state(false);
	let tocOpen = $state(false);
	let mobileSearchOpen = $state(false);

	function toggleMobileSearch() {
		mobileSearchOpen = !mobileSearchOpen;
	}

	function checkScroll() {
		if (!browser) return;
		isScrolled = window.scrollY > 10;
	}

	function toggleToc() {
		tocOpen = !tocOpen;
	}

	$effect(() => {
		if (!browser) return;
		checkScroll();
		window.addEventListener('scroll', checkScroll, { passive: true });
		return () => window.removeEventListener('scroll', checkScroll);
	});

	$effect(() => {
		void page.url.pathname;
		if (browser) {
			isScrolled = false;
			tocOpen = false;
			mobileSearchOpen = false;
			setTimeout(checkScroll, 50);
		}
	});
</script>

<header class="global-header" class:scrolled={isScrolled}>
    <div class="header-row">
        <div class="header-left">
            <button 
                class="header-menu-btn" 
                class:open={menuOpen}
                onclick={onMenuClick}
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
                <span class="menu-burger"></span>
            </button>
            
            <a href={resolveRoutePath('/')} class="header-brand">
                <img class="header-logo" src={resolveRoutePath(LOGO_ASSET_PATH)} alt={`${SITE_NAME} logo`} />
                <span class="header-brand-text">{SITE_NAME}</span>
            </a>
        </div>
        
	        <div class="header-center">
	            <SearchBar />
	        </div>
	        
	        <div class="header-right">
	            <button class="header-icon-btn search-icon-btn" onclick={toggleMobileSearch} aria-label={mobileSearchOpen ? 'Close search' : 'Search'}>
	                <IconMagnify width="20" height="20" />
	            </button>
	            {#each HEADER_BUTTONS as button}
	                {@const ButtonIcon = button.icon ? getIconComponent(button.icon) : null}
	                <a
	                    href={button.href}
	                    target="_blank"
	                    rel="noopener noreferrer"
	                    class="header-icon-btn"
	                    aria-label={button.label ?? 'Open external link'}
	                >
	                    {#if ButtonIcon}
	                        <ButtonIcon width={20} height={20} />
	                    {:else if button.label}
	                        <span class="header-icon-fallback">{button.label.slice(0, 1).toUpperCase()}</span>
	                    {/if}
	                </a>
	            {/each}
	        </div>
	    </div>
    
    {#if showToc && tocItems.length > 0}
        <div class="header-toc-row">
            <button class="toc-trigger" class:open={tocOpen} onclick={toggleToc}>
                <span class="toc-label">On this page</span>
                <span class="toc-chevron" class:open={tocOpen}>
                    <IconChevronDown width="20" height="20" />
                </span>
            </button>
            
            {#if tocOpen}
                <div class="toc-dropdown">
                    <TableOfContents items={tocItems} selector=".docs-content" title="" />
                </div>
            {/if}
        </div>
    {/if}
    
</header>

{#if mobileSearchOpen}
    <SearchBar mode="modal" onclose={() => mobileSearchOpen = false} />
{/if}

<style lang="scss">
    @use '../../tokens' as *;

    .global-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: $z-header;
        background-color: var(--background-one);
        display: flex;
        flex-direction: column;

        &.scrolled {
            box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.4);
        }
    }

    .header-row {
        display: flex;
        align-items: center;
        justify-content: center;
        height: $header-height;
        padding: 0 24px;
    }

    .header-left {
        display: none;
        align-items: center;
        gap: 8px;
    }

    .header-right {
        position: absolute;
        right: 24px;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .header-menu-btn {
        display: none;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 12px;
        color: var(--text-one);
        cursor: pointer;

        &:hover {
            background-color: var(--tertiary);
        }

        &.open .menu-burger {
            background: transparent;

            &::before { transform: rotate(45deg); }
            &::after { transform: rotate(-45deg); }
        }
    }

    .menu-burger {
        display: flex;
        width: 20px;
        height: 2px;
        background: var(--text-one);
        position: relative;

        &::before, &::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 2px;
            background: var(--text-one);
        }

        &::before { transform: translateY(-6px); }
        &::after { transform: translateY(6px); }
    }

    .header-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: inherit;
    }

    .header-logo {
        height: 22px;
        width: auto;
        flex-shrink: 0;
    }

    .header-brand-text {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-one);
    }

    .header-center {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 560px;
    }

    .header-icon-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 12px;
        color: var(--text-four);
        cursor: pointer;
        text-decoration: none;

        &:hover {
            background-color: var(--tertiary);
            color: var(--text-one);
        }
    }

	    .search-icon-btn {
	        display: none;
	    }

	    .header-icon-fallback {
	        font-size: 13px;
	        font-weight: 600;
	        line-height: 1;
	    }

    .header-toc-row {
        display: none;
        padding: 12px 24px 12px;
        position: relative;
        z-index: $z-header;
        background-color: var(--background-one);
    }

    .toc-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 8px 0;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-one);
    }

    .toc-label {
        flex: 1;
        text-align: left;
    }

    .toc-chevron {
        flex-shrink: 0;
        color: var(--text-four);

        &.open {
            transform: rotate(180deg);
        }
    }

    .toc-dropdown {
        padding-top: 8px;
        max-height: 45vh;
        overflow-y: auto;
        scrollbar-width: none;

        &::-webkit-scrollbar { display: none; }
        :global(.toc-title) { display: none; }
        :global(.toc) { position: static; }
    }

    @media (max-width: $bp-desktop) {
        .header-row {
            justify-content: flex-end;
            padding: 0 16px;
        }

        .header-right { right: 16px; }
        .search-icon-btn { display: flex; }
        .header-center { display: none; }

        .header-toc-row {
            display: block;
            padding: 12px 40px 12px;
            margin-left: $sidebar-width;
        }
    }

    @media (max-width: $bp-mobile) {
        .global-header { z-index: $z-header-mobile; }

        .header-row {
            justify-content: space-between;
            padding: 0 8px;
        }

        .header-left { display: flex; }
        .header-right { right: 8px; }
        .header-menu-btn { display: flex; }
        .header-brand { display: flex; }
        .header-center { display: none; }

        .header-toc-row {
            margin-left: 0;
            padding: 12px 16px 12px;
        }
    }
</style>
