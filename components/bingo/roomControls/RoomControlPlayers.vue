<template>
    <div class="room-control-player">
        <h5 v-for="player in sortedPlayers">
            {{ player.nickname }}
            <p>{{ player.color }}</p>
            <p>{{ player.score }}</p>
        </h5>
    </div>
</template>
<script setup>
const props = defineProps({ payload: { type: Object } });
//payload.players
//payload.score
const sortedPlayers = computed(() => {
    // Combine players with their scores
    return Object.values(props.payload.players).map(player => ({
        ...player,
        score: props.payload.score.scoreBoard[player.color] || 0 // default to 0 if no score
    }))
        // Sort players by score in descending order
        .sort((a, b) => b.score - a.score);
});

</script>
<style lang="scss"></style>