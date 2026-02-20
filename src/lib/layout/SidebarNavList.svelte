<script lang="ts">
    import type { ClientDocsSection, ClientDocsPage } from '../core/types';
    import { resolveRoutePath } from '../utils/paths';

    interface Props {
        activeSection: ClientDocsSection | null;
        regularSections: ClientDocsSection[];
        currentPath: string;
    }

    let { activeSection, regularSections, currentPath }: Props = $props();

    function isActive(routePath: string): boolean {
        return currentPath === routePath;
    }

    function groupByCategory(pages: ClientDocsPage[]): { category: string; pages: ClientDocsPage[] }[] {
        const groups: { category: string; pages: ClientDocsPage[] }[] = [];
        const seen = new Map<string, ClientDocsPage[]>();

        for (const p of pages) {
            const cat = p.category;
            if (seen.has(cat)) {
                seen.get(cat)!.push(p);
            } else {
                const arr = [p];
                seen.set(cat, arr);
                groups.push({ category: cat, pages: arr });
            }
        }
        return groups;
    }
</script>

{#snippet sectionGroups(groups: { category: string; pages: ClientDocsPage[] }[], fallbackLabel?: string)}
    {#each groups as group (group.category)}
        <div class="nav-section">
            {#if group.category || fallbackLabel}
                <span class="section-label">{group.category || fallbackLabel}</span>
            {/if}
            <ul class="nav-list">
                {#each group.pages as docPage (docPage.routePath)}
                    {@const href = resolveRoutePath(docPage.routePath)}
                    <li>
                        <a
                            {href}
                            class="nav-link"
                            class:active={isActive(docPage.routePath)}
                        >
                            {docPage.title}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    {/each}
{/snippet}

<div class="nav-items">
    {#if activeSection}
        {@render sectionGroups(groupByCategory(activeSection.pages))}
    {:else}
        {#each regularSections as section (section.id)}
            {@render sectionGroups(groupByCategory(section.pages), section.title)}
        {/each}
    {/if}
</div>

<style lang="scss">
    .nav-items {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .nav-section {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .section-label {
        display: block;
        padding: 8px 12px;
        font-weight: 600;
        font-size: 14px;
        color: var(--text-one);
    }

    .nav-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .nav-link {
        display: block;
        padding: 8px 12px;
        color: var(--text-ee);
        text-decoration: none;
        font-size: 14px;
        border-radius: 6px;

        &:hover {
            color: var(--text-one);
            background-color: var(--tertiary);
        }

        &:focus-visible {
            outline: 2px solid var(--primary);
            outline-offset: 2px;
            background-color: var(--tertiary);
            color: var(--text-one);
        }

        &.active {
            color: var(--primary);
            background-color: var(--tertiary);
        }
    }
</style>
