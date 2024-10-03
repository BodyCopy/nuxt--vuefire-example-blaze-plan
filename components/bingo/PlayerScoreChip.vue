<template>
    <div class="player-score-chip">
        <div :class="['player-score-chip-color', 'bingo-color', color]"></div>
        <SegmentDisplay :string="scoreDisplay"></SegmentDisplay>
    </div>
</template>
<script setup>
const props = defineProps({ color: String, score: Number });
const scoreDisplay = computed(() => {
    return props.score.toString().padStart(2, '0');
})
</script>
<style lang="scss">
.player-score-chip {
    display: flex;
    gap: 0.5rem;
    --segment-display-height: 1.25rem;
}

.player-score-chip-color {
    aspect-ratio: 1/1;
    height: 1.25rem;
    background-color: var(--selector-button-color);
    border-radius: 4px;
    box-shadow: var(--tile-box-shadow-subtle);
}
</style>