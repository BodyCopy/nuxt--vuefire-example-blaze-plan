<template>
    <div class="player-id-header">
        <ColorSelectorButton :flat="true" :color="props.color"></ColorSelectorButton>
        <p class="retro">
            <slot>{{ props.nickname }}</slot>
        </p>
    </div>
</template>
<script setup>
const props = defineProps({ color: String, nickname: String, colorChipSize: { Type: Number, default: 24 } });
const colorChipSize = computed(() => {
    return `${props.colorChipSize}px`;
})
</script>
<style lang="scss">
.player-id-header {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: v-bind(colorChipSize) minmax(max-content, 1fr);
    align-items: center;

    &>.color-selector-button {
        aspect-ratio: 1/1;
    }
}
</style>