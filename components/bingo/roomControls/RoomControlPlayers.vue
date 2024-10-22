<template>
    <div class="room-control-player ttb-layout">
        <PlayerRoomStatCard v-for="player in sortedPlayers" :player="player" :gameType="roomData.gameType">
        </PlayerRoomStatCard>
    </div>
</template>
<script setup>
const props = defineProps({ payload: { type: Object } });
const roomData = inject('roomData');
//payload.players
//payload.score
const sortedPlayers = computed(() => {
    // Combine players with their scores
    return Object.values(props.payload.players).map(player => ({
        ...player,
        score: props.payload.score[player.color] || 0 // default to 0 if no score
    }))
        // Sort players by score in descending order
        .sort((a, b) => b.score - a.score);
});

</script>
<style lang="scss">
.room-control-player{

}
</style>