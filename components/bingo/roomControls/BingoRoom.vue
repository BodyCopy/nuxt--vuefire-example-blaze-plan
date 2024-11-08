<template>
    <div class="bingo-room">
        <div class="bingo-room-section">
            <!-- <header class="room-header">
                <h1>{{ roomData.roomName }}</h1>
                <BaseButton btn-modifier="micro" @click="copyLink">
                    Share
                </BaseButton>
            </header> -->
            <div class="room-data calculator-screen">
                <RoomScore :scores="scoreBoard" :bingos="scoreData.bingos"></RoomScore>
                <RoomTimer v-if="roomStore.roomData.hasTimer" :startTime="roomData.createdOn" :isPaused="false" />
            </div>
            <div class="room-view calculator-screen">
                <Transition name="fade" mode="out-in">
                    <component class="room-view-content" :is="roomViews[activeView]" :bingo-items="bingoItemKeys"
                        :bingos="bingos">
                    </component>
                </Transition>
            </div>
            <nav class="room-view-nav">
                <BaseButtonSet v-model="activeView" width="fc" :options="roomViewValues">
                </BaseButtonSet>
            </nav>
        </div>
        <!-- <RoomControls :roomData :scoreData :scoreBoard :bingoCardData :player></RoomControls> -->
    </div>
</template>
<script setup>
import { doc, collection, setDoc, getDoc, updateDoc, serverTimestamp, FieldValue, increment, addDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useFirestore, useDocument } from "vuefire";
import { useStorage as vueUseStorage } from "@vueuse/core";
import IconExternalLink from "~/components/icons/IconExternalLink.vue";
import { createSnackbar } from '~/stores/snackbar.js';
import { useUserStore } from "~/stores/userStore.js";
import { useRoom } from "~/composables/useRoom.js";
import ChatLog from "./roomLog/ChatLog.vue";
import BingoCard from "../card/BingoCard.vue";
import BingoPlayers from "../players/BingoPlayers.vue";
import RoomControlSettings from "./RoomControlSettings.vue";
import { useRoomStore } from "~/stores/room/roomStore";
const props = defineProps({ roomData: { type: Object }, scoreData: { type: Object } });
//    middleware: 'check-room-password'
const db = useFirestore();
const route = useRoute();
const roomStore = useRoomStore();
const { logEvent } = useRoom(route.params.id);
const { text, copy } = useClipboard();
function copyLink() {
    copy(`miss.bingo/rooms/${route.params.id}`);
    createSnackbar({ type: 'info', message: 'Link copied to clipboard' })
}
// const roomId = computed(() => route.params.id);
const { user } = useUserStore();
// const user = useCurrentUser();
const activeView = vueUseStorage('room-view', 'bingo-card');
const roomViewOptions = { Card: 'bingo-card', Scores: 'detailed-score-board', Chat: 'chat-log' };
const roomViewValues = computed(() => {
    if (user.value === roomStore.roomData.creator.uid) {
        return { ...roomViewOptions, Settings: 'room-settings' };
    } else {
        return roomViewOptions;
    }
})
const roomViews = {
    'bingo-card': BingoCard,
    'detailed-score-board': BingoPlayers,
    'chat-log': ChatLog,
    'room-settings': RoomControlSettings,
}

const player = computed(() => {
    console.log('ROOMDATA', props.roomData);

    if (user.value && props.roomData) {
        console.log('PLAYER', user.value);

        return { ...props.roomData.players[user.value], uuid: user.value }
    } else {
        return {};
    }
});
provide('loggedInPlayer', player);

// const scoreData = ref({});
const scoreBoard = computed(() => {
    if (props.scoreData.teams) {
        const scores = extractAndSortTeamScores(props.scoreData.teams);
        return scores;
    } else {
        return {};
    }
});
function extractAndSortTeamScores(teams) {
    // Create an array to hold the team scores
    const teamScores = Object.entries(teams)
        .map(([teamColor, teamData]) => {
            // Ensure the score exists, default to 0 if it's undefined
            return [teamColor, teamData.score || 0];
        });

    // Sort the array by the score in descending order
    const sortedTeamScores = teamScores.sort(([colorA, scoreA], [colorB, scoreB]) => {
        if (scoreB !== scoreA) {
            return scoreB - scoreA; // Sort by score
        }
        return colorA.localeCompare(colorB); // Tie-breaker by color
    });

    // Convert the sorted array back to an object
    return Object.fromEntries(sortedTeamScores);
}

//check if the rooms game type is shared of multi
//if it's shared return the single bingo card else
//return the card associated with the players color
const docRef = computed(() => {
    if (props.roomData.gameType === 'multi') {
        return doc(db, `rooms/${route.params.id}/cards/${roomStore.activePlayer.cardId}`);
    } else {
        return doc(db, `rooms/${route.params.id}/cards/card`);
    }
})
const bingoCardData = useDocument(docRef);


const gameMode = computed(() => props.roomData.gameMode);
//fix
const bingos = computed(() => props.scoreData.bingos);
//[{red:true},{blue:true, red:true}...]
const bingoItemKeys = computed(() => {
    if (bingoCardData.value?.bingoItems) {
        const orderedItems = Object.keys(bingoCardData.value.bingoItems)
            .sort((a, b) => {
                // Extract the number from the key and compare numerically
                const numA = parseInt(a.replace('item', ''), 10);
                const numB = parseInt(b.replace('item', ''), 10);
                return numB - numA;
            })
            .map(key => bingoCardData.value.bingoItems[key]); // Convert sorted keys back to array of objects
        return orderedItems;
    } else {
        return [];
    }
})
const { toggleItemCompletion, focusItem, initPlayer, updatePlayerColor } = useLocalRoom();

provide('updatePlayerColor', updatePlayerColor);
provide('toggleItemCompletion', toggleItemCompletion);
provide('focusItem', focusItem);

onMounted(async () => {
    console.log('USER VALUE', user.value);
    await initPlayer(user.value);
})


async function checkPassword() {
    // Your logic
}


function useLocalRoom() {
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

    async function toggleItemCompletion(coordinates) {
        console.log('CLICKED');

        const items = bingoCardData.value.bingoItems;

        let scoreBingos = JSON.parse(JSON.stringify(bingos.value));
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
                const firstItemColor = items[`item-${line[0]}`].complete;

                // Check if all items in the line have the same non-empty color
                const isComplete = firstItemColor !== '' && line.every(i => items[`item-${i}`].complete === firstItemColor);
                // console.log('COMPLETE', isComplete, scoreBingos[bingoIndex]);

                // If the line is complete and not yet marked, mark it
                if (isComplete && !(scoreBingos[bingoIndex]?.[player.value.color])) {
                    scoreBingos[bingoIndex] = { ...(scoreBingos[bingoIndex] || {}), [player.value.color]: true };
                }
                // If the line was marked but is now incomplete, unmark it
                else if (!isComplete && scoreBingos[bingoIndex]?.[player.value.color]) {
                    console.log('UNMARK');
                    scoreBingos[bingoIndex] = { ...(scoreBingos[bingoIndex] || {}), [player.value.color]: false };
                }
            }

            // Update bingos only once after all checks
            console.log('SCORE BINGOS', scoreBingos);

            await updateDoc(doc(db, `rooms/${route.params.id}/scores/scoreBoard`),
                {
                    'bingos': scoreBingos,
                    [`teams.${player.value.color}.score`]: increment(val ? 1 : -1)
                })
            await updateDoc(docRef.value,
                {
                    [`bingoItems.item-${index}.complete`]: val,
                }
            );
            console.log('UPDATED DOC', player.value.color);
            logEvent('Cell complete', { coordinates: coordinates, player: 'test' });
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
        //             [`bingoItems.item-${index}.focusedBy`]: arrayUnion(user.value)
        //         }
        //     );
        // } else {
        //     await updateDoc(roomDocRef.value,
        //         {
        //             [`bingoItems.item-${index}.focusedBy`]: arrayRemove(user.value)
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
        if (!props.roomData.players[uuid]) {
            try {
                await updateDoc(roomDocRef, {
                    [`players.${uuid}`]: {
                        joinedOn: serverTimestamp()
                    }
                })
                const roomRef = doc(collection(db, `users/${uuid}/rooms`), roomId.value);
                await setDoc(roomRef, { roomName: props.roomData.name, roomId: roomId.value, joinedOn: serverTimestamp() }, { merge: true });
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log('PLAYER EXISTS');
        }
    }
    return { toggleItemCompletion, focusItem, getBingoLines, initPlayer, updatePlayerColor }
}


</script>
<style lang="scss">
@use '~/assets/css/01-config/mixins.module.scss';

.bingo-room {
    display: grid;
    grid-template-columns: 1fr;
    --player-color: v-bind(player.color); //todo:afterIdentifyingPlayer match colour this needs to be a v-bind
    --room-control-header-height: 3rem;
    height: calc(100dvh - (var(--top-nav-height) + 0.5rem)); //calc with header

    &-section {
        display: grid;
        grid-template-areas:
            'd'
            'v'
            'n';
        grid-template-rows: max-content 1fr max-content;
        grid-template-columns: 1fr;
    }

    @include mixins.mediaTabletLandscape('min') {
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

.room-data {
    grid-area: d;
    position: relative;
    overflow: hidden;
    margin-inline: 0.5rem;
    margin-block-end: 0.5rem;
    grid-area: s t;
    gap: 1px;
}

.room-score {}

.room-timer {}

.room-timer,
.room-score {
    background-color: var(--calculator-screen-background);
    background-blend-mode: color-dodge;

    &>*:first-child {
        width: 4.5rem;

        &:after {
            content: ':';
        }
    }
}

.room-view {
    grid-area: v;
    margin-inline: 0.5rem;

    // align-items: center;
    display: flex;
    container: room-view / size;

    &-content {
        overflow-y: auto;
        height: 100cqmin;
        width: 100%;

        @include mixins.mediaTabletLandscape('max') {
            height: 100cqmax;
        }
    }
}

.room-view-nav {
    grid-area: n;
    padding: 1rem;
    background-color: black;

    & .active {
        color: var(--primary-color-base) !important;

        &:before {
            content: '*'
        }

        &:after {
            content: '*'
        }
    }
}

// .fade-enter-active,
// .fade-leave-active {
//     transition: opacity 0.2s;
// }

// .fade-enter-from,
// .fade-leave-to {
//     opacity: 0;
// }</style>