<template>
    <div class="bingo-room">
        <div class="bingo-room-section">
            <header class="room-header">
                <h1>{{ roomData.roomName }}</h1>
                <BaseButton btn-modifier="micro" @click="copyLink">
                    <!-- <template #icon>
                        <IconLink />
                    </template> -->
                    Share
                </BaseButton>
            </header>
            <RoomScore :scores="scoreData"></RoomScore>
            <RoomTimer :startTime="roomData.createdOn" :isPaused="false" />
            <!-- <div class="room-card">
                <BingoCard :bingo-items="bingoItemKeys" :bingos="bingos"></BingoCard>
            </div> 
            something here
            -->
        </div>
        <RoomControls :roomData :scoreData :player></RoomControls>
    </div>
</template>
<script setup>
import { doc, collection, setDoc, getDoc, updateDoc, serverTimestamp, FieldValue, increment, addDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useFirestore, useDocument } from "vuefire";
import IconExternalLink from "~/components/icons/IconExternalLink.vue";
import { createSnackbar } from '~/stores/snackbar.js';
definePageMeta({
    title: 'Room',
    linkTitle: `test`,
    order: 1,
    layout: 'room-layout',
})
//    middleware: 'check-room-password'
const db = useFirestore();
const route = useRoute();
const { text, copy } = useClipboard();
function copyLink() {
    copy(`rooms/${route.params.id}`);
    createSnackbar({ type: 'info', message: 'Link copied to clipboard' })
}
// const roomId = computed(() => route.params.id);
const user = useCurrentUser();

const roomDocRef = computed(() => doc(collection(db, 'rooms'), route.params.id));
const roomData = useDocument(roomDocRef);
const player = computed(() => {
    if (user.value) {
        return { ...roomData.value.players[user.value.uid], uuid: user.value.uid }
    } else {
        return {};
    }
});
const scoreData = ref(null);
let scoreDataRef;
const bingoCardData = ref(null);
let bingoCardRef;

watch(user, (nV, oV) => {

    scoreDataRef = collection(roomDocRef.value, 'scores');
    const { data: scoreTempData } = useCollection(scoreDataRef, { target: scoreData });
    const test = useDocument(doc(roomDocRef.value, `cards/${player.value.color}-card`), { target: bingoCardData });

    console.log('BingoCArdDat', roomDocRef.value, bingoCardData.value, player.value, scoreData.value, test.value);
})

// const sortedScores = computed(() => {
//     // Combine players with their scores
//     return Object.values(roomData.value.score.scoreBoard).map(color => ({
//         ...color,
//         score: roomData.value.score.scoreBoard[color] || 0 // default to 0 if no score
//     }))
//         .sort((a, b) => b.score - a.score);
// });
provide('roomData', roomData);

const gameMode = computed(() => roomData.value.gameMode);
//fix
// const bingos = computed(() => scoreData.value.find(s => s.id === 'bingos'));

const bingoItemKeys = computed(() => {
    if (bingoCardData) {
        console.log(bingoCardData.value);
        const orderedItems = Object.keys(bingoCardData.value.bingoItems)
            .sort((a, b) => {
                // Extract the number from the key and compare numerically
                const numA = parseInt(a.replace('item', ''), 10);
                const numB = parseInt(b.replace('item', ''), 10);
                return numB - numA;
            })
            .map(key => bingoCardData.value.bingoItems[key]); // Convert sorted keys back to array of objects
        console.log('ORDERED', orderedItems);
        return orderedItems;
    } else {
        return null;
    }
})
const { toggleItemCompletion, focusItem, initPlayer, updatePlayerColor, updateRoomData } = useRoom();

provide('updatePlayerColor', updatePlayerColor);
provide('toggleItemCompletion', toggleItemCompletion);
provide('focusItem', focusItem);
provide('updateRoomData', updateRoomData);

onMounted(async () => {
    await getCurrentUser();
    console.log('USER VALUE', user.value);
    await initPlayer(user.value.uid);
})


async function checkPassword() {
    // Your logic
}


function useRoom() {
    const bingoLines = (() => { return getBingoLines() })();
    async function updateLog(payload) {
        const player = payload.player;
        const action = payload.action;
        const value = payload.value;
    }
    async function updatePlayerColor(color) {
        try {
            await updateDoc(roomDocRef.value, {
                [`players.${player.value.uuid}.color`]: color
            })
            console.log('NEW COLOR', color);

        } catch (err) {
            console.log(err);
        }
    }
    async function updateRoomData(field, value) {
        console.log('updating', field);
        try {
            await updateDoc(roomDocRef.value,
                {
                    [field]: value
                }
            );
        } catch (err) {
            console.log(err);
        }
    }
    async function toggleItemCompletion(coordinates) {
        const items = bingoCardData.value.bingoItems;
        const bingos = bingos.value;

        let scoreBingos = JSON.parse(JSON.stringify(bingos));
        // Toggle the completion state of the clicked item
        let index = [(coordinates[0] * 5) + coordinates[1]];

        let val = '';
        if (bingoCardData.value.bingoItems[`item-${index}`].complete === '') {
            val = player.value.color;
        } else if (bingoCardData.value.bingoItems[`item-${index}`].complete === player.value.color) {
            val = '';
        } else {
            return;
        }
        // Update the local state of the item
        items[`item-${index}`].complete = val;  // Update the completion state locally

        // Check for any completed or uncompleted bingos

        try {
            ///////////////
            // Iterate over all possible bingo lines (rows, columns, diagonals)
            for (const [bingoIndex, line] of bingoLines.entries()) {
                // Get the color of the first item in the line to compare with others
                const firstItemColor = items[`item-${line[0]}`].complete;

                // Check if all items in the line have the same non-empty color
                const isComplete = firstItemColor !== '' && line.every(i => items[`item-${i}`].complete === firstItemColor);

                // If the line is complete and not yet marked as bingo, mark it
                if (isComplete && !bingos[bingoIndex]) {
                    scoreBingos[bingoIndex] = player.value.color; // Mark the line as bingo
                }
                // If the line was marked as bingo but is now incomplete, unmark it
                else if (!isComplete && bingos[bingoIndex]) {
                    scoreBingos[bingoIndex] = ''; // Unmark the line as bingo
                }
            }

            // Update bingos only once after all checks
            console.log('SCORE BINGOS', scoreBingos);

            //update this 
            // await updateDoc(roomDocRef.value,
            //     {
            //         'score.bingos': scoreBingos,
            //         [`bingoItems.item-${index}.complete`]: val,
            //         [`score.scoreBoard.${player.value.color}`]: increment(val ? 1 : -1)
            //     }
            // );
        } catch (err) {
            console.log(err);
        }
    }

    // update this
    async function focusItem(coordinates, action) {
        // let index = [(coordinates[0] * 5) + coordinates[1]];
        // if (action === 'add') {
        //     await updateDoc(roomDocRef.value,
        //         {
        //             [`bingoItems.item-${index}.focusedBy`]: arrayUnion(user.value.uid)
        //         }
        //     );
        // } else {
        //     await updateDoc(roomDocRef.value,
        //         {
        //             [`bingoItems.item-${index}.focusedBy`]: arrayRemove(user.value.uid)
        //         }
        //     );
        // }
    }
    function getBingoLines() {
        const lines = [];

        // Rows (indices 0-4)
        for (let row = 0; row < 5; row++) {
            const rowIndices = Array.from({ length: 5 }, (_, i) => row * 5 + i);
            lines.push(rowIndices);
        }

        // Columns (indices 5-9)
        for (let col = 0; col < 5; col++) {
            const colIndices = Array.from({ length: 5 }, (_, i) => i * 5 + col);
            lines.push(colIndices);
        }

        // Diagonal 1 (index 10)
        const diagonal1 = [0, 6, 12, 18, 24];
        lines.push(diagonal1);

        // Diagonal 2 (index 11)
        const diagonal2 = [4, 8, 12, 16, 20];
        lines.push(diagonal2);

        return lines;
    }
    async function initPlayer(uuid) {
        if (!roomData.value.players[uuid]) {
            try {
                await updateDoc(roomDocRef, {
                    [`players.${uuid}`]: {
                        joinedOn: serverTimestamp()
                    }
                })
                const roomRef = doc(collection(db, `users/${uuid}/rooms`), roomId.value);
                await setDoc(roomRef, { roomName: roomData.value.name, roomId: roomId.value, joinedOn: serverTimestamp() }, { merge: true });
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log('PLAYER EXISTS');
        }
    }
    return { toggleItemCompletion, focusItem, getBingoLines, initPlayer, updatePlayerColor, updateRoomData }
}


</script>
<style lang="scss">
@import '~/assets/css/01-config/mixins.module.scss';

.bingo-room {
    display: grid;
    grid-template-columns: 1fr;
    --player-color: v-bind(player.color); //todo:afterIdentifyingPlayer match colour this needs to be a v-bind
    --room-control-header-height: 3rem;
    height: calc(100dvh - (var(--top-nav-height) + 0.5rem)); //calc with header

    &-section {
        display: grid;
        grid-template-areas:
            'h'
            's'
            't'
            'c'
            '.';
        grid-template-rows: max-content max-content max-content 1fr var(--room-control-header-height);
        grid-template-columns: 1fr;
    }

    @include mediaTabletLandscape('min') {
        &-section {
            display: grid;
            grid-template-areas:
                'h h r'
                'c c r'
                'c c .';
            grid-template-columns: max-content 1fr 1fr;
            grid-template-rows: auto;
        }
    }
}

.room-header {
    grid-area: h;
    padding: 0.5rem;
    display: flex;

    &>h1 {
        color: var(--S-05);
        margin-inline-end: auto;
        font-size: 1.5rem;
    }
}

.room-score {
    grid-area: s;
}

.room-timer {
    grid-area: t;
}

.room-timer,
.room-score {
    &>*:first-child {
        width: 4.5rem;

        &:after {
            content: ':';
        }
    }
}

.room-card {
    grid-area: c;
    // align-items: center;
    display: flex;
}

//contains the codes for the differant player colors
.bingo-color {
    &.red {
        --selector-button-color: hsl(9, 98%, 59%, 1);
    }

    &.orange {
        --selector-button-color: #FD7427;
    }

    &.yellow {
        --selector-button-color: #FFB401;
    }

    &.green {
        --selector-button-color: #00820B;
    }

    &.teal {
        --selector-button-color: #0ABBD3;
    }

    &.blue {
        --selector-button-color: #4279FA;
    }

    &.purple {
        --selector-button-color: #9747FF;
    }

    &.pink {
        --selector-button-color: #FF00E5;
    }
}
</style>