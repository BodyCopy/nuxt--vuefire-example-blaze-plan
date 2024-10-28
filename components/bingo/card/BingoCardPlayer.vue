<template>
    <div class="bingo-card-player calculator-screen-item">
        <!-- <IconUser /> -->
        <ColorSelectorButton :flat="true" :color="activePlayer.color" />
        <h5 class="bingo-card-player-nickname" :title="activePlayer.nickname || 'Anon'">{{
            activePlayer.nickname || 'Anon' }}</h5>
        <SegmentDisplay :string="playerScoreToString" :displayBoard="true"/>
    </div>
</template>
<script setup>
import { useRoomStore } from '~/stores/room/roomStore';
import { useScoreStore } from '~/stores/room/scoreStore';
const roomStore = useRoomStore();
const scoreStore = useScoreStore();
const playerScoreToString = computed(() => {
    console.log('SCORE DATA', scoreStore.scoreData.teams[activePlayer.value.color]);

    return scoreStore.scoreData.teams[activePlayer.value.color].score.toString().padStart(2, '0');
})
const { activePlayer } = storeToRefs(roomStore);
//scoreBoard[props.player.color]
</script>
<style lang="scss">
.bingo-card-player {
    display: grid;
    align-items: center;
    grid-template-columns: 2rem 1fr max-content;
    height: var(--bingo-card-player-height);
    grid-column: span 5;
    padding-inline: 0.5rem;
    gap: 0.75rem;
    --segment-display-height: calc(var(--bingo-card-player-height) - 1rem);

    &-nickname {
        font-family: var(--font-ibm);
        font-variation-settings: 'wght' 360, 'wdth' 85;
        letter-spacing: 0.3em;
        font-size: 1.5rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        margin-block-end: -0.125em;
    }

    &>.color-selector-button {
        height: calc(var(--bingo-card-player-height) - 1rem);
    }
}
</style>