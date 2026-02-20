<script lang="ts">
    import { page } from '$app/state';
    import { resolve } from '$app/paths';
    import { SITE_TITLE } from '$lib/config';
</script>

<svelte:head>
    <title>Error {page.status} | {SITE_TITLE}</title>
</svelte:head>

<div class="error-page">
    <span class="status">{page.status}</span>
    <h1>{page.error?.message || 'Something went wrong'}</h1>
    <a href={resolve('/')}>Back to home</a>
</div>

<style lang="scss">
    .error-page {
        max-width: 900px;
        margin: 0 auto;
        padding: 80px 40px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .status {
        font-size: 5rem;
        font-weight: 800;
        color: var(--primary);
        line-height: 1;
    }

    h1 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-one);
    }

    a {
        margin-top: 8px;
        color: var(--primary);
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
</style>
