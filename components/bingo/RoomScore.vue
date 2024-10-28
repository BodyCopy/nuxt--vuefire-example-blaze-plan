<template>
    <div class="room-score">
        <h5>Score</h5>
        <div class="score-overflow">
            <RoomScoreBingoBanner v-if="newBingo" :color="newBingo"></RoomScoreBingoBanner>
            <PlayerScoreChip v-show="!newBingo" v-for="(val, key) in sortedScoreData" :color="key" :score="val"
                :key="key">
            </PlayerScoreChip>
        </div>
    </div>
</template>
<script setup>
import { useScoreStore } from '~/stores/room/scoreStore';
const scoreStore = useScoreStore();
const { sortedScoreData, bingos } = storeToRefs(scoreStore);
const newBingo = ref(false);

let newBingoTimer;
watch(bingos, (newBingos, oldBingos) => {
    newBingos.forEach((newBingoObj, index) => {
        const oldBingoObj = oldBingos[index] || {};
        // Check for any new colors in the current bingo object
        for (const color in newBingoObj) {
            if (newBingoObj[color] && !oldBingoObj[color]) {
                if (newBingoTimer) clearTimeout(newBingoTimer);
                newBingo.value = color; // Add new color to newBingo
                //remove after 10 seconds
                newBingoTimer = setTimeout(() => {
                    newBingo.value = false;
                }, 5000)
            }
        }
    });
},
    { deep: true }
);

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

.score-overflow {
    gap: 1rem;
    height: calc(100% + 1rem);
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scroll-snap-type: proximity;

    &>*:after {
        // content: '';
        // margin-block: 0.25rem;
        // display: inline-block;
        // height: 100%;
        // border-inline-end: 1px solid var(--S-30);
    }
}

/* Transition styles */
// .room-scores-move {
//   transition: transform 0.25s linear;
// }</style>