<script lang="ts">
    import PageAnchor from '../components/PageAnchor.svelte';
    import type { ClientDocsSection } from '../core/types';
    import { sectionIcons } from '../config';
    import { resolveRoutePath } from '../utils/paths';

    interface Props {
        sections: ClientDocsSection[];
        activeSectionId: string | null;
    }

    let { sections, activeSectionId }: Props = $props();

    function getSectionHref(section: ClientDocsSection): string {
        const firstPage = section.pages[0];
        if (!firstPage) return resolveRoutePath('/');
        return resolveRoutePath(firstPage.routePath);
    }
</script>

<div class="page-anchors">
    {#each sections as section (section.id)}
        {@const SectionIcon = sectionIcons[section.id]}
        <PageAnchor
            href={getSectionHref(section)}
            title={section.title}
            active={activeSectionId === section.id}
        >
            {#if SectionIcon}<SectionIcon width={20} height={20} />{/if}
        </PageAnchor>
    {/each}
</div>

<style lang="scss">
    .page-anchors {
        display: flex;
        flex-direction: column;
        padding: 0 4px;
    }
</style>
