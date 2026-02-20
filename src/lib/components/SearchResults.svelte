<script lang="ts">
    import type { SearchHit } from '$lib/utils/search';
    import SearchResult from './SearchResult.svelte';

    interface Props {
        results: SearchHit[];
        query: string;
        selectedIndex: number;
        hasSearched: boolean;
        showHint?: boolean;
        onselect: (hit: SearchHit) => void;
        onhover: (index: number) => void;
    }

    let {
        results,
        query,
        selectedIndex,
        hasSearched,
        showHint = false,
        onselect,
        onhover,
    }: Props = $props();
</script>

{#if results.length > 0}
    <div class="results-list">
        {#each results as hit, i}
            <SearchResult
                {hit}
                {query}
                selected={i === selectedIndex}
                onclick={() => onselect(hit)}
                onhover={() => onhover(i)}
            />
        {/each}
    </div>
{:else if query.trim() && hasSearched}
    <div class="search-status empty">No results found for "<b>{query}</b>"</div>
{:else if showHint && !query.trim()}
    <div class="search-status hint">Start typing to search the documentation</div>
{/if}

<style lang="scss">
    .results-list {
        display: flex;
        flex-direction: column;
        padding: 6px;
    }

    .search-status {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 24px 18px;
        justify-content: center;
        font-size: 13px;
        color: var(--text-four);
    }

    b {
        padding: 0;
        margin: 0;
        font-weight: 600;
    }
</style>
