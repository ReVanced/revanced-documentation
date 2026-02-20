<script lang="ts">
    interface Props {
        size?: number;
        class?: string;
        label?: string;
    }

    let { size = 18, class: className = '', label = '' }: Props = $props();
</script>

<span
    class="spinner {className}"
    style={`--spinner-size:${size}px`}
    role={label ? 'status' : undefined}
    aria-label={label || undefined}
    aria-hidden={label ? undefined : 'true'}
></span>
