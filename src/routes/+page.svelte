<script lang="ts">
    import { SITE_TITLE, SITE_NAME, SITE_DESCRIPTION } from '$lib/config';
</script>

<svelte:head>
    <title>{SITE_TITLE}</title>
    <meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

<div class="landing-page">
    <h1>Welcome to <span class="highlight">{SITE_TITLE}</span></h1>
</div>

<style lang="scss">
    .landing-page {
        max-width: 900px;
        margin: 0 auto;
        padding: 48px 40px 80px;
        text-align: center;
    }

    h1 {
        font-size: 2.75rem;
        font-weight: 700;
        color: var(--text-one);
        line-height: 1.2;
    }

    .highlight {
        color: var(--primary);
    }

    @media (max-width: 768px) {
        .landing-page {
            padding: 32px 20px 60px;
        }

        h1 {
            font-size: 2rem;
        }
    }
</style>
