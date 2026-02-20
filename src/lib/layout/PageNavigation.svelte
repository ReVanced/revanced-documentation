<script lang="ts">
    import { page } from '$app/state';
    import type { DocsPagination, DocsPaginationLink } from '../core/types';
    import { sectionIcons } from '../config';
    import { resolveRoutePath } from '../utils/paths';

    const emptyPagination: DocsPagination = {
        prev: null,
        next: null,
    };

    let pagination = $derived((page.data.pagination as DocsPagination | undefined) ?? emptyPagination);
    let prevPage = $derived((pagination.prev as DocsPaginationLink | null) ?? null);
    let nextPage = $derived((pagination.next as DocsPaginationLink | null) ?? null);
</script>

{#if prevPage || nextPage}
    <nav class="page-navigation">
        {#if prevPage}
            {@const PrevIcon = sectionIcons[prevPage.sectionId]}
            <a href={resolveRoutePath(prevPage.routePath)} class="nav-card prev">
                <div class="nav-icon">
                    {#if PrevIcon}<PrevIcon width={24} height={24} />{/if}
                </div>
                <div class="nav-content">
                    <span class="nav-title">{prevPage.title}</span>
                    <span class="nav-description">{prevPage.sectionTitle}</span>
                </div>
            </a>
        {:else}
            <div class="nav-spacer"></div>
        {/if}
        
        {#if nextPage}
            {@const NextIcon = sectionIcons[nextPage.sectionId]}
            <a href={resolveRoutePath(nextPage.routePath)} class="nav-card next">
                <div class="nav-icon">
                    {#if NextIcon}<NextIcon width={24} height={24} />{/if}
                </div>
                <div class="nav-content">
                    <span class="nav-title">{nextPage.title}</span>
                    <span class="nav-description">{nextPage.sectionTitle}</span>
                </div>
            </a>
        {:else}
            <div class="nav-spacer"></div>
        {/if}
    </nav>
{/if}

<style lang="scss">
    .page-navigation {
        display: flex;
        gap: 16px;
        margin-top: 48px;
    }

    .nav-card {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 20px;
        border: 1px solid var(--tertiary);
        border-radius: 12px;
        text-decoration: none !important;
        color: inherit;

        &, * {
            text-decoration: none !important;
        }

        &:hover {
            border-color: var(--text-ee);
            background-color: rgba(255, 255, 255, 0.02);
        }

        &.next {
            align-items: flex-end;
            text-align: right;

            .nav-icon {
                align-self: flex-end;
            }
        }
    }

    .nav-spacer {
        flex: 1;
    }

    .nav-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: 1px solid var(--tertiary);
        border-radius: 50%;
        background-color: transparent;
        color: var(--text-one);

        :global(svg) {
            fill: var(--text-one);
            width: 20px;
            height: 20px;
        }
    }

    .nav-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .nav-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-one);
    }

    .nav-description {
        font-size: 14px;
        color: var(--text-ee);
    }
</style>
