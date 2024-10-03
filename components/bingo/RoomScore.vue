<template>
    <div class="room-score">
        <h5>Score</h5>
        <!-- <PlayerScoreChip v-for="(val, key) in scores" :color="key" :score="val"></PlayerScoreChip> -->
    </div>
</template>
<script setup>
const props = defineProps({ scores: { type: Object }, timer: Boolean });
const flattedScores = computed(()=>{
    console.log(props.scores);
})
</script>
<style lang="scss">
.room-score {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 0.5rem;
    padding: 0.5rem;
    border-block-start: 1px solid var(--S-30);
}
</style>