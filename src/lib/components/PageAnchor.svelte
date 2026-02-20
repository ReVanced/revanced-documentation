<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        href: string;
        title: string;
        active: boolean;
        children: Snippet;
    }

    let { href, title, active, children }: Props = $props();
</script>

<a {href} class="page-anchor" class:active={active}>
    <div class="icon-container">
        {@render children()}
    </div>
    {title}
</a>

<style lang="scss">
    .page-anchor {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        font-family: var(--main-font), serif;
        font-size: 16px;
        color: var(--text-one);
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        text-align: left;
        text-decoration: none;
        height: 42px;
        user-select: none;
        -webkit-user-select: none;
        transition: none;

        &.active {
            color: var(--primary);

            .icon-container {
                background-color: var(--primary);
            }

            :global(svg) {
                fill: var(--background-one);
                color: var(--background-one);
            }
        }

        &:hover {
            color: var(--text-one);

            :global(svg) {
                fill: var(--secondary);
                color: var(--secondary);
            }

            .icon-container {
                border: 1px solid var(--secondary);
                background-color: var(--tertiary);
            }

            &.active {
                color: var(--primary);

                .icon-container {
                    background-color: var(--primary);
                    border-color: var(--primary);
                }

                :global(svg) {
                    fill: var(--background-one);
                    color: var(--background-one);
                }
            }
        }

        :global(svg) {
            fill: var(--text-one);
            color: var(--text-one);
            transition: none;
        }
    }

    .icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--tertiary);
        width: 28px;
        height: 28px;
        background-color: var(--surface-four);
        border-radius: 8px;
        transition: none;
    }
</style>