<template>
    <div class="bingo-player-stat-card">
        <SegmentDisplay :string="playerScore" :displayBoard="true"></SegmentDisplay>
        <PlayerIdHeader :color="player.color" :nickname="player.nickname"></PlayerIdHeader>
        <PlayerBingoCardPreview v-if="player.nickname !== loggedInPlayer.nickname && gameSettings.gameType === 'multi'"
            :playerCardId="player.cardId">
        </PlayerBingoCardPreview>
    </div>
</template>
<script setup>
import { useRoomStore } from '~/stores/room/roomStore';
import SegmentDisplay from '~/components/base/data/SegmentDisplay.vue';
const loggedInPlayer = inject('loggedInPlayer');
const roomStore = useRoomStore()
const { gameSettings } = storeToRefs(roomStore);
const props = defineProps({ player: { type: Object } });
const playerScore = computed(() => {
    return props.player.score.toString().padStart(2, '0');
})
</script>
<style lang="scss">
.bingo-player-stat-card {
    padding: 1rem 0.5rem;
    --segment-display-height: 1.75rem;
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.5rem;
}

.player-bingo-card-preview {
    grid-column: span 2;
}
</style>