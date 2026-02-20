<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: className = '' }: Props = $props();
</script>

<div class="segmented-button {className}">
	{@render children()}
</div>

<style lang="scss">
	.segmented-button {
		display: flex;
		gap: 2px;
		align-items: stretch;
	}

	.segmented-button :global(> .button:first-child) {
		border-radius: 100px 24px 24px 100px;
	}

	.segmented-button :global(> .button:last-child) {
		border-radius: 24px 100px 100px 24px;
	}

	.segmented-button :global(> .button:not(:first-child):not(:last-child)) {
		border-radius: 24px;
	}

	.segmented-button :global(> .button:only-child) {
		border-radius: 100px;
	}
</style>
