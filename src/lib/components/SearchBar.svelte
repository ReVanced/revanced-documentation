<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import IconMagnify from '~icons/mdi/magnify';
	import IconClose from '~icons/mdi/close';
	import Spinner from './Spinner.svelte';
	import SearchResults from './SearchResults.svelte';
	import { ensureIndex, isReady, search, type SearchHit } from '$lib/utils/search';
	import { resolveRoutePath } from '$lib/utils/paths';

	interface Props {
		mode?: 'inline' | 'modal';
		onclose?: () => void;
	}

	let { mode = 'inline', onclose }: Props = $props();

	let indexReady = $state(isReady());
	let indexError = $state<string | null>(null);
	let query = $state('');
	let results = $state<SearchHit[]>([]);
	let hasSearched = $state(false);
	let showDropdown = $state(false);
	let selectedIndex = $state(-1);
	let dropdownId = $derived(`search-results-${mode}`);

	let inputEl = $state<HTMLInputElement | null>(null);
	let dropdownEl = $state<HTMLDivElement | null>(null);
	let modalPanelEl = $state<HTMLDivElement | null>(null);

	async function prepareIndex() {
		if (indexReady || indexError) {
			return;
		}

		try {
			await ensureIndex();
			indexReady = true;
		} catch {
			indexError = 'Search is unavailable right now.';
		}
	}

	$effect(() => {
		void (async () => {
			await prepareIndex();
			if (mode === 'modal') {
				await tick();
				inputEl?.focus();
			}
		})();

		if (mode === 'inline') {
			const onGlobalKey = (e: KeyboardEvent) => {
				if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
					e.preventDefault();
					inputEl?.focus();
				}
			};
			window.addEventListener('keydown', onGlobalKey);
			return () => window.removeEventListener('keydown', onGlobalKey);
		}

		if (mode === 'modal') {
			const onGlobalModalKey = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					e.preventDefault();
					onclose?.();
					return;
				}

				trapModalFocus(e);
			};
			window.addEventListener('keydown', onGlobalModalKey);
			return () => window.removeEventListener('keydown', onGlobalModalKey);
		}
	});

	$effect(() => {
		void page.url.pathname;
		resetState();
	});

	let searchTimer: ReturnType<typeof setTimeout> | undefined;

	function onInput() {
		if (!indexReady) {
			return;
		}

		showDropdown = true;
		clearTimeout(searchTimer);
		if (!query.trim()) {
			resetState();
			return;
		}

		searchTimer = setTimeout(() => {
			results = search(query);
			hasSearched = true;
			selectedIndex = results.length > 0 ? 0 : -1;
		}, 60);
	}

	function resetState() {
		query = '';
		results = [];
		hasSearched = false;
		showDropdown = false;
		selectedIndex = -1;
	}

	function getAnchorOffset(target: HTMLElement): number {
		const rawOffset = getComputedStyle(target).scrollMarginTop;
		const parsed = Number.parseFloat(rawOffset);
		return Number.isFinite(parsed) ? parsed : 80;
	}

	function scrollToAnchor(anchor: string, retries = 3) {
		const el = document.getElementById(anchor);
		if (el) {
			const offset = getAnchorOffset(el);
			el.scrollIntoView({ behavior: 'instant', block: 'start' });
			window.scrollBy(0, -offset);
		} else if (retries > 0) {
			requestAnimationFrame(() => scrollToAnchor(anchor, retries - 1));
		}
	}

	function toHref(routePath: string): string {
		return resolveRoutePath(routePath);
	}

	function navigateTo(hit: SearchHit) {
		const route = toHref(hit.url);
		const target = hit.anchor ? `${route}#${hit.anchor}` : route;
		resetState();
		if (mode === 'modal') {
			onclose?.();
		}

		goto(target).then(() => {
			if (hit.anchor) {
				tick().then(() => requestAnimationFrame(() => scrollToAnchor(hit.anchor)));
			}
		});
	}

	function trapModalFocus(e: KeyboardEvent) {
		if (mode !== 'modal' || e.key !== 'Tab' || !modalPanelEl) {
			return;
		}

		const focusable = Array.from(
			modalPanelEl.querySelectorAll<HTMLElement>(
				'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
			),
		).filter((el) => !el.hasAttribute('aria-hidden'));

		if (focusable.length === 0) {
			e.preventDefault();
			return;
		}

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const active = document.activeElement;

		if (!active || !modalPanelEl.contains(active)) {
			e.preventDefault();
			first.focus();
			return;
		}

		if (!e.shiftKey && active === last) {
			e.preventDefault();
			first.focus();
		} else if (e.shiftKey && active === first) {
			e.preventDefault();
			last.focus();
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			if (mode === 'modal') {
				onclose?.();
			} else {
				showDropdown = false;
				inputEl?.blur();
			}
			return;
		}

		trapModalFocus(e);

		if (!showDropdown || !results.length) {
			return;
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
			scrollSelectedIntoView();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, -1);
			scrollSelectedIntoView();
		} else if (e.key === 'Enter' && selectedIndex >= 0) {
			e.preventDefault();
			navigateTo(results[selectedIndex]);
		}
	}

	function scrollSelectedIntoView() {
		tick().then(() => {
			dropdownEl
				?.querySelector('.result-item.selected')
				?.scrollIntoView({ block: 'nearest' });
		});
	}

	function onFocus() {
		if (query.trim() || indexError) {
			showDropdown = true;
		}
	}

	function onBlur() {
		if (mode === 'modal') {
			return;
		}

		setTimeout(() => {
			const active = document.activeElement;
			if (!dropdownEl?.contains(active) && active !== inputEl) {
				showDropdown = false;
			}
		}, 200);
	}
</script>

{#snippet searchIcon(size: number)}
	<span class="search-icon">
		{#if !indexReady && !indexError}
			<Spinner {size} />
		{:else}
			<IconMagnify width={size} height={size} />
		{/if}
	</span>
{/snippet}

{#snippet searchInput(size: number)}
	<input
		bind:this={inputEl}
		bind:value={query}
		oninput={onInput}
		onfocus={onFocus}
		onblur={onBlur}
		onkeydown={onKeyDown}
		type="text"
		placeholder={indexError ?? (indexReady ? 'Search documentation...' : 'Loading index...')}
		disabled={!indexReady && !indexError}
		class="search-input"
		autocomplete="off"
		spellcheck="false"
		aria-label="Search documentation"
		role="combobox"
		aria-autocomplete="list"
		aria-controls={dropdownId}
		aria-expanded={showDropdown && (results.length > 0 || query.trim().length > 0 || Boolean(indexError))}
	/>
{/snippet}

{#if mode === 'modal'}
	<div
		class="search-modal-overlay"
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) {
				onclose?.();
			}
		}}
	>
		<div
			class="search-modal-panel"
			bind:this={modalPanelEl}
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-label="Search documentation"
			onkeydown={onKeyDown}
		>
			<div class="search-modal-input-wrapper">
				{@render searchIcon(20)}
				{@render searchInput(16)}
				<button
					class="clear-btn"
					onclick={query
						? () => {
								resetState();
								inputEl?.focus();
						  }
						: onclose}
					aria-label={query ? 'Clear search' : 'Close search'}
				>
					<IconClose width={18} height={18} />
				</button>
			</div>

			<div id={dropdownId} class="search-modal-results" bind:this={dropdownEl} role="listbox">
				{#if indexError}
					<div class="search-status error" role="status">{indexError}</div>
				{:else}
					<SearchResults
						{results}
						{query}
						{selectedIndex}
						{hasSearched}
						showHint
						onselect={navigateTo}
						onhover={(i) => (selectedIndex = i)}
					/>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div class="search-container">
		<div class="search-input-wrapper">
			{@render searchIcon(18)}
			{@render searchInput(14)}
			{#if query}
				<button
					class="clear-btn"
					onclick={() => {
						resetState();
						inputEl?.focus();
					}}
					aria-label="Clear search"
				>
					<IconClose width={16} height={16} />
				</button>
			{/if}
		</div>

		{#if showDropdown && (indexError || (query.trim() && (results.length > 0 || hasSearched)))}
			<div id={dropdownId} class="search-dropdown" bind:this={dropdownEl} role="listbox">
				{#if indexError}
					<div class="search-status error" role="status">{indexError}</div>
				{:else}
					<SearchResults
						{results}
						{query}
						{selectedIndex}
						{hasSearched}
						onselect={navigateTo}
						onhover={(i) => (selectedIndex = i)}
					/>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	@use '../../tokens' as *;

	@mixin thin-scrollbar {
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.15) transparent;

		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background-color: rgba(255, 255, 255, 0.15);
			border-radius: 3px;

			&:hover {
				background-color: rgba(255, 255, 255, 0.25);
			}
		}
	}

	.search-icon {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		color: var(--text-four);
		opacity: 0.7;
	}

	.search-input {
		flex: 1;
		height: 100%;
		padding: 0;
		background: transparent;
		border: none;
		outline: none !important;
		box-shadow: none !important;
		color: var(--text-one);
		font-family: inherit;

		&::placeholder {
			color: var(--text-four);
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}
	}

	.clear-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 6px;
		color: var(--text-four);
		cursor: pointer;

		&:hover {
			background-color: var(--tertiary);
			color: var(--text-one);
		}
	}

	.search-container {
		position: relative;
		width: 100%;
		max-width: $search-max-width;
	}

	.search-input-wrapper {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		height: 40px;
		padding: 0 14px;
		background-color: var(--surface-three);
		border: 1px solid var(--border);
		border-radius: 12px;

		&:hover {
			background-color: var(--surface-four);
			border-color: var(--text-four);
		}

		&:focus-within {
			border-color: var(--primary);
			background-color: var(--surface-four);
		}

		.search-input {
			font-size: 14px;
		}
	}

	.search-dropdown {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		right: 0;
		background-color: var(--background-one);
		border: 1px solid var(--border);
		border-radius: 14px;
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.4),
			0 4px 12px rgba(0, 0, 0, 0.2);
		z-index: $z-dropdown;
		max-height: 420px;
		overflow-y: auto;
		overscroll-behavior: contain;
		@include thin-scrollbar;
	}

	.search-modal-overlay {
		position: fixed;
		inset: 0;
		z-index: $z-modal;
		background-color: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 60px 16px 24px;
	}

	.search-modal-panel {
		width: 100%;
		max-width: 580px;
		background-color: var(--background-one);
		border: 1px solid var(--border);
		border-radius: 16px;
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.5),
			0 8px 20px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
		max-height: calc(100vh - 100px);
		overflow: hidden;
	}

	.search-modal-input-wrapper {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 16px;
		height: 52px;
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;

		.search-input {
			font-size: 16px;
		}
	}

	.search-modal-results {
		flex: 1;
		overflow-y: auto;
		overscroll-behavior: contain;
		min-height: 80px;
		max-height: calc(100vh - 200px);
		@include thin-scrollbar;
	}

	.search-status {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px 18px;
		font-size: 13px;
		color: var(--text-four);
	}

	.search-status.error {
		color: var(--text-ee);
	}

	@media (max-width: $bp-mobile) {
		.search-modal-overlay {
			padding: 20px 12px 24px;
		}

		.search-modal-panel {
			border-radius: 14px;
			max-height: calc(100vh - 60px);
		}
	}
</style>
