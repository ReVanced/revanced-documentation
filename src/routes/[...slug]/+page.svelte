<script lang="ts">
    import type { PageData } from './$types';
    import type { Component } from 'svelte';
    import { SITE_TITLE, SITE_DESCRIPTION } from '$lib/config';
    
    let { data }: { data: PageData } = $props();
    
    const PageComponent = $derived(data.component as Component);
</script>

<svelte:head>
    <title>{data.title} - {data.section} | {SITE_TITLE}</title>
    <meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

<PageComponent />
