<template>
    <div class="bingo-players ttb-layout">
        <BingoPlayerStatCard v-for="(player, key) in sortedPlayers" :player :gameType="roomData.gameType"
            class="calculator-screen-item">
        </BingoPlayerStatCard>
    </div>
</template>
<script setup>
import { useRoomStore } from '~/stores/room/roomStore.js';
import { useScoreStore } from '~/stores/room/scoreStore.js';
const { roomData } = useRoomStore();
const { sortedScoreData } = useScoreStore();
const props = defineProps({ payload: { type: Object } });
//payload.players
//payload.score
const sortedPlayers = computed(() => {
    // Combine players with their scores
    return Object.values(roomData.players).map(player => ({
        ...player,
        score: sortedScoreData[player.color] || 0 // default to 0 if no score
    }))
        // Sort players by score in descending order
        .sort((a, b) => b.score - a.score);
});

</script>
<style lang="scss">
.bingo-players {
    gap: 1px;
}
</style>