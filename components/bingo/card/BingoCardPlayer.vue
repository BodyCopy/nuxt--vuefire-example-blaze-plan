<template>
    <div class="bingo-card-player calculator-screen-item">
        <!-- <IconUser /> -->
        <ColorSelectorButton :flat="true" :color="activePlayer.color" />
        <h5 class="bingo-card-player-nickname" :title="activePlayer.nickname || 'Anon'">{{
            activePlayer.nickname || 'Anon' }}</h5>
        <SegmentDisplay :string="playerScoreToString" :displayBoard="true" />
    </div>
</template>
<script setup>
import { useRoomStore } from '~/stores/room/roomStore';
import { useScoreStore } from '~/stores/room/scoreStore';
const roomStore = useRoomStore();
const scoreStore = useScoreStore();
const playerScoreToString = computed(() => {
    if (scoreStore.scoreData.teams[activePlayer.value.color]) {
        return scoreStore.scoreData.teams[activePlayer.value.color].score.toString().padStart(2, '0');
    } else {
        return '00';
    }
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
    gap: 0.25rem;
    --segment-display-height: calc(var(--bingo-card-player-height) - 1rem);

    &-nickname {
        // animation: wiggle-pickllle 3s ease forwards;
        font-size: 1.5rem;
        // font-variation-settings: "COUT" 282, "JMBL" 175, "STGR" 100;
        font-family: var(--font-ibm);
        font-variation-settings: 'wght' 640;
        letter-spacing: 0.1em;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        margin-block-end: -0.25em;
        padding-inline: 0.5rem;
        // text-shadow: 1px 1px 2px red, 0 0 1em blue, 0 0 0.2em blue;
    }

    &>.color-selector-button {
        height: calc(var(--bingo-card-player-height) - 1rem);
    }
}
</style>