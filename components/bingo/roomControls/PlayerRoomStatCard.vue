<template>
    <div class="player-room-stat-card">
        <SegmentDisplay :string="playerScore" :displayBoard="true"></SegmentDisplay>
        <PlayerIdHeader :color="player.color" :nickname="player.nickname"></PlayerIdHeader>
    </div>
</template>
<script setup>
import SegmentDisplay from '~/components/base/data/SegmentDisplay.vue';

const props = defineProps({ player: { type: Object }, gameType: { type: String } });
const playerScore = computed(() => {
    return props.player.score.toString().padStart(2, '0');
})
</script>
<style lang="scss">
.player-room-stat-card {
    --segment-display-height: 1.75rem;
    display: flex;
    gap: 0.5rem;
}
</style>