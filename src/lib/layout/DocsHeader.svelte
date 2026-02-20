<script lang="ts">
	import { page } from '$app/state';
	import SegmentedButton from '../components/SegmentedButton.svelte';
	import Button from '../components/Button.svelte';
	import IconContentCopy from '~icons/mdi/content-copy';
	import IconPencil from '~icons/mdi/pencil-outline';
	import { copyToClipboard } from '../utils/copy';
	import { normalizePathname } from '../utils/paths';

	interface Props {
		title: string;
		showCopyButton?: boolean;
	}

	let { title, showCopyButton = true }: Props = $props();

	let editUrl = $derived(page.data?.editUrl as string | undefined);
	let routePath = $derived(normalizePathname(page.url.pathname));

	async function handleCopy() {
		if (routePath === '/') {
			return;
		}

		await copyToClipboard(window.location.href);
	}
</script>

<header class="docs-header">
	<h1 class="docs-title">{title}</h1>

	{#if showCopyButton}
		<div class="header-actions">
			<SegmentedButton>
				<Button onclick={handleCopy}>
					{#snippet icon()}
						<IconContentCopy width="20" height="20" />
					{/snippet}
					Copy
				</Button>
				<Button href={editUrl} target="_blank" rel="noopener noreferrer" disabled={!editUrl}>
					{#snippet icon()}
						<IconPencil width="20" height="20" />
					{/snippet}
					Edit
				</Button>
			</SegmentedButton>
		</div>
	{/if}
</header>

<style lang="scss">
	.docs-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}

	.docs-title {
		font-size: 2.25rem;
		font-weight: 700;
		color: var(--text-one);
		margin: 0;
		line-height: 1.2;
		flex: 1;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 0.3em;
		position: relative;
	}

	:global(.header-actions svg) {
		fill: currentColor;
	}
</style>
