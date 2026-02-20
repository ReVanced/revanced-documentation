<script lang="ts">
	import { page } from '$app/state';
	import type { TableOfContentsItem } from '../core/types';

	interface Props {
		items: TableOfContentsItem[];
		selector?: string;
		title?: string;
	}

	let { items, selector = '.main-content', title = 'On this page' }: Props = $props();

	let activeIds = $state(new Set<string>());
	let indicatorTop = $state(0);
	let indicatorHeight = $state(0);
	let indicatorVisible = $state(false);
	let listEl = $state<HTMLUListElement | null>(null);
	let navEl = $state<HTMLElement | null>(null);

	function computeActiveIds(headings: HTMLElement[]): Set<string> {
		const active = new Set<string>();
		const viewTop = 56;
		const viewBottom = window.innerHeight;

		for (const heading of headings) {
			const rect = heading.getBoundingClientRect();
			if (rect.top < viewBottom && rect.bottom > viewTop) {
				active.add(heading.id);
			}
		}

		if (active.size === 0) {
			for (let i = headings.length - 1; i >= 0; i--) {
				if (headings[i].getBoundingClientRect().top <= viewTop) {
					active.add(headings[i].id);
					break;
				}
			}
		}

		return active;
	}

	function updateIndicator(ids: Set<string>) {
		if (!listEl || ids.size === 0) {
			indicatorVisible = false;
			return;
		}

		const listRect = listEl.getBoundingClientRect();
		let minTop = Infinity;
		let maxBottom = -Infinity;

		for (const id of ids) {
			const linkEl = listEl.querySelector(`[href="#${CSS.escape(id)}"]`) as HTMLElement | null;
			if (!linkEl) continue;
			const rect = linkEl.getBoundingClientRect();
			const top = rect.top - listRect.top;
			const bottom = top + rect.height;
			if (top < minTop) minTop = top;
			if (bottom > maxBottom) maxBottom = bottom;
		}

		if (minTop === Infinity) {
			indicatorVisible = false;
			return;
		}

		indicatorTop = minTop;
		indicatorHeight = maxBottom - minTop;
		indicatorVisible = true;
	}

	function syncTocScroll() {
		const scrollParent = navEl?.parentElement;
		if (!scrollParent) return;

		const tocMaxScroll = scrollParent.scrollHeight - scrollParent.clientHeight;
		if (tocMaxScroll <= 0) return;

		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		if (docHeight <= 0) return;

		const progress = window.scrollY / docHeight;
		scrollParent.scrollTop = progress * tocMaxScroll;
	}

	function setupObserver(): (() => void) | undefined {
		if (typeof document === 'undefined' || items.length === 0) {
			activeIds = new Set();
			indicatorVisible = false;
			return;
		}

		const container = document.querySelector(selector);
		if (!container) {
			activeIds = new Set();
			indicatorVisible = false;
			return;
		}

		const headings = items
			.map((item) => document.getElementById(item.id))
			.filter((heading): heading is HTMLElement => heading instanceof HTMLElement);

		if (headings.length === 0) {
			activeIds = new Set();
			indicatorVisible = false;
			return;
		}

		const update = () => {
			const ids = computeActiveIds(headings);
			activeIds = ids;
			updateIndicator(ids);
			syncTocScroll();
		};

		update();

		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update, { passive: true });

		return () => {
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		};
	}

	$effect(() => {
		void page.url.pathname;
		void items;
		return setupObserver();
	});
</script>

{#if items.length > 0}
	<nav class="toc" aria-label="Table of contents" bind:this={navEl}>
		{#if title}
			<div class="toc-title">{title}</div>
		{/if}
		<div class="toc-list-wrapper">
			<div
				class="toc-indicator"
				class:visible={indicatorVisible}
				style:top="{indicatorTop}px"
				style:height="{indicatorHeight}px"
			></div>
			<ul class="toc-list" bind:this={listEl}>
				{#each items as item (item.id)}
					<li class="toc-item" style:--level={item.level - 2}>
						<a href="#{item.id}" class="toc-link" class:active={activeIds.has(item.id)}>
							{item.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</nav>
{/if}

<style lang="scss">
	.toc-title {
		color: var(--text-one);
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 12px;
	}

	.toc-list-wrapper {
		position: relative;
	}

	.toc-indicator {
		position: absolute;
		left: 0;
		width: 2px;
		background-color: var(--primary);
		border-radius: 1px;
		transition: top 150ms ease, height 150ms ease, opacity 150ms ease;
		opacity: 0;
		z-index: 1;

		&.visible {
			opacity: 1;
		}
	}

	.toc-list {
		margin: 0;
		padding: 0;
		list-style: none;
		border-left: 1px solid var(--tertiary, rgba(255, 255, 255, 0.1));
	}

	.toc-item {
		margin: 0;
		padding: 0;
	}

	.toc-link {
		display: block;
		padding: 6px 12px;
		padding-left: calc(12px + var(--level, 0) * 12px);
		color: var(--text-ee);
		text-decoration: none;
		font-size: 13px;
		line-height: 1.4;
		margin-left: -1px;
		transition: color 200ms ease;

		&:hover {
			color: var(--text-one);
		}

		&.active {
			color: var(--primary);
		}
	}
</style>
