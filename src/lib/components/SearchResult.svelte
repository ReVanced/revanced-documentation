<script lang="ts">
    import type { SearchHit } from '$lib/utils/search';
    import { highlightMatch, getSnippet } from '$lib/utils/search';
    import { sectionIcons, getIconComponent } from '$lib/config';

    interface Props {
        hit: SearchHit;
        query: string;
        selected?: boolean;
        onclick: () => void;
        onhover: () => void;
    }

    let { hit, query, selected = false, onclick, onhover }: Props = $props();

    let SectionIcon = $derived(sectionIcons[hit.sectionId] ?? getIconComponent(hit.sectionIcon));
</script>

<button
    class="result-item"
    class:selected
    {onclick}
    onmouseenter={onhover}
    role="option"
    aria-selected={selected}
>
    <span class="result-icon">
        <SectionIcon width={18} height={18} />
    </span>
    <div class="result-content">
        <span class="result-title">{@html highlightMatch(hit.title, query)}</span>
        <span class="result-section">{hit.section}</span>
        <span class="result-snippet">{@html highlightMatch(getSnippet(hit.text, query), query)}</span>
    </div>
</button>

<style lang="scss">
    .result-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 10px 12px;
        border: none;
        background: transparent;
        text-align: left;
        font-family: inherit;
        cursor: pointer;
        border-radius: 10px;
        width: 100%;
        color: var(--text-one);

        &:hover, &.selected {
            background-color: var(--surface-three);
        }
    }

    .result-icon {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        margin-top: 2px;
        color: var(--text-four);
        opacity: 0.6;
    }

    .result-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    .result-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-one);
        line-height: 1.3;

        :global(mark) {
            background-color: var(--tertiary);
            color: inherit;
            border-radius: 2px;
            padding: 0 1px;
        }
    }

    .result-section {
        font-size: 12px;
        color: var(--text-four);
        opacity: 0.8;
    }

    .result-snippet {
        font-size: 12px;
        color: var(--text-four);
        opacity: 0.85;
        line-height: 1.4;
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;

        :global(mark) {
            background-color: var(--tertiary);
            color: inherit;
            border-radius: 2px;
            padding: 0 1px;
        }
    }
</style>
