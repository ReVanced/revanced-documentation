<script lang="ts">
	import type { Snippet } from 'svelte';
	import { copyToClipboard } from '$lib/utils/copy';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
	let container: HTMLElement;
	const resetTimers = new Map<HTMLButtonElement, ReturnType<typeof setTimeout>>();

	$effect(() => {
		if (!container) return;
		const onClick = (event: Event) => {
			void handleContainerClick(event as MouseEvent);
		};
		container.addEventListener('click', onClick);
		return () => {
			container.removeEventListener('click', onClick);
			for (const timer of resetTimers.values()) {
				clearTimeout(timer);
			}
		};
	});

	async function handleContainerClick(event: MouseEvent) {
		const target = event.target;
		if (!(target instanceof Element)) return;

		const button = target.closest<HTMLButtonElement>('.code-copy-btn');
		if (!button || !container.contains(button)) return;

		const wrapper = button.closest('.code-block-wrapper');
		const code = wrapper?.querySelector('pre code')?.textContent;
		if (!code) return;

		const success = await copyToClipboard(code);
		if (!success) return;

		button.classList.add('copied');

		const previous = resetTimers.get(button);
		if (previous) clearTimeout(previous);

		const timer = setTimeout(() => {
			button.classList.remove('copied');
			resetTimers.delete(button);
		}, 2000);

		resetTimers.set(button, timer);
	}

</script>

<div class="copy-code" bind:this={container}>
	{@render children()}
</div>

<style lang="scss">
	.copy-code :global(.code-block-wrapper) {
		position: relative;
		margin: 1.5rem 0;

		:global(pre) {
			margin: 0;
		}

		&:hover :global(.code-copy-btn) {
			opacity: 1;
			pointer-events: auto;
		}
	}

	.copy-code :global(.code-copy-btn) {
		position: absolute;
		top: 8px;
		right: 8px;
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 6px 10px;
		border: none;
		border-radius: 6px;
		background-color: var(--surface-four);
		color: var(--text-ee);
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		opacity: 0;
		pointer-events: none;

		&:hover {
			background-color: var(--surface-five);
			color: var(--text-one);
		}

	}

	.copy-code :global(.code-copy-btn.copied) {
		background-color: var(--tertiary);
		color: var(--primary);
	}

	@media (hover: none) {
		.copy-code :global(.code-copy-btn) {
			opacity: 1;
			pointer-events: auto;
		}
	}
</style>
