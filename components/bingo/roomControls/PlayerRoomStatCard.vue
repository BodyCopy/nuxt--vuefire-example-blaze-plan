<template>
    <div class="player-room-stat-card">
        <SegmentDisplay :string="playerScore" :displayBoard="true"></SegmentDisplay>
        <PlayerIdHeader :color="player.color" :nickname="player.nickname"></PlayerIdHeader>
        <PlayerBingoCardPreview v-if="player.nickname !== loggedInPlayer.nickname && gameType === 'multi'"
            :playerCardId="player.cardId">
        </PlayerBingoCardPreview>
    </div>
</template>
<script setup>
import { useUserData } from '~/stores/userData';
import SegmentDisplay from '~/components/base/data/SegmentDisplay.vue';
const { userNickname } = useUserData();
const loggedInPlayer = inject('loggedInPlayer');
const props = defineProps({ player: { type: Object }, gameType: { type: String } });
const playerScore = computed(() => {
    return props.player.score.toString().padStart(2, '0');
})
</script>
<style lang="scss">
.player-room-stat-card {
    --segment-display-height: 1.75rem;
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.5rem;
}

.player-bingo-card-preview {
    grid-column: span 2;
}
</style>