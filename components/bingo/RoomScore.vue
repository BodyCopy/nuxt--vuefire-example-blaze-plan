<template>
    <div class="room-score">
        <h5>Score</h5>
        <div class="score-overflow">
            <PlayerScoreChip v-for="(val, key) in scores" :color="key" :score="val"></PlayerScoreChip>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({ scores: { type: Object }, timer: Boolean });

</script>
<style lang="scss">
.room-score {
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    // border-block-start: 1px solid var(--S-30);
}
.score-overflow{
    gap: 1rem;
    height: calc(100% + 1rem);
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scroll-snap-type: proximity;
    & > *:after{
        // content: '';
        // margin-block: 0.25rem;
        // display: inline-block;
        // height: 100%;
        // border-inline-end: 1px solid var(--S-30);
    }
}
</style>