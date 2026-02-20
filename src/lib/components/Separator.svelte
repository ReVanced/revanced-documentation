<script lang="ts">
    interface Props {
        orientation?: "vertical" | "horizontal";
    }

    let { orientation = "horizontal"}: Props = $props();
</script>

<div class="separator" class:vertical={orientation === "vertical"} class:horizontal={orientation === "horizontal"}></div>

<style lang="scss">
    .separator {
        background-color: var(--tertiary);

        &.vertical {
            width: 1px;
            height: 100%;
        }

        &.horizontal {
            height: 1px;
            width: 100%;
        }
    }
</style>