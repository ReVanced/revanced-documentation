<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'filled' | 'text';
		disabled?: boolean;
		href?: string;
		target?: string;
		rel?: string;
		onclick?: (event: MouseEvent) => void;
		children: Snippet;
		icon?: Snippet;
		class?: string;
	}

	let {
		variant = 'filled',
		disabled = false,
		href,
		target,
		rel,
		onclick,
		children,
		icon,
		class: className = '',
	}: Props = $props();
</script>

{#if href && !disabled}
	<a {href} {target} {rel} class="button {variant} {className}" {onclick}>
		{#if icon}
			<span class="icon">{@render icon()}</span>
		{/if}
		<span class="label">{@render children()}</span>
	</a>
{:else}
	<button type="button" class="button {variant} {className}" {disabled} {onclick}>
		{#if icon}
			<span class="icon">{@render icon()}</span>
		{/if}
		<span class="label">{@render children()}</span>
	</button>
{/if}

<style lang="scss">
	.button {
		padding: 8px 12px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		gap: 8px;
		cursor: pointer;
		font-weight: 600;
		user-select: none;
		-webkit-user-select: none;
		outline: none;
		border-radius: 100px;
		border: none;
		text-decoration: none;
		transition: none;
		background-color: var(--surface-three, var(--secondary));
		color: var(--text-ee);
		box-shadow: none;

		&:focus-visible {
			outline: 2px solid var(--primary-container, rgba(0, 0, 0, 0.2));
			outline-offset: 2px;
		}

		&:hover:not(:disabled) {
			background-color: var(--surface-four, var(--primary));
			color: var(--text-one);
		}

		&.text {
			background-color: transparent;
			color: var(--primary);
			padding: 10px 12px;

			&:hover:not(:disabled) {
				background-color: var(--primary-container, rgba(0, 0, 0, 0.05));
			}
		}

		&:disabled {
			opacity: 0.38;
			cursor: not-allowed;
		}
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;

		:global(svg) {
			width: 18px;
			height: 18px;
		}
	}

	.label {
		white-space: nowrap;
	}

	a.button {
		display: inline-flex;
		text-decoration: none !important;
	}
</style>
