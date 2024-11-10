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
                <RoomScore></RoomScore>
                <RoomTimer v-if="roomStore.roomData.hasTimer" :startTime="roomStore.roomData.createdOn"
                    :isPaused="false" />
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
    </div>
</template>
<script setup>
import { doc, collection, setDoc, updateDoc, serverTimestamp, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import { useFirestore, useDocument } from "vuefire";
import { useStorage as vueUseStorage } from "@vueuse/core";
import { useSnackbar } from "~/composables/useSnackbar";
import { useUserStore } from "~/stores/userStore.js";
import { useRoom } from "~/composables/useRoom.js";
import { useRoomStore } from "~/stores/room/roomStore";
import { useScoreStore } from "~/stores/room/scoreStore";
import { checkBingo, sortBingoItems } from "~/utilities/bingoUtilities";

import ChatLog from "./roomLog/ChatLog.vue";
import BingoCard from "./card/BingoCard.vue";
import BingoPlayers from "./players/BingoPlayers.vue";
import RoomControlSettings from "./settings/RoomControlSettings.vue";
const { createSnackbar } = useSnackbar();
const db = useFirestore();
const route = useRoute();
const roomStore = useRoomStore();
const activePlayerColor = computed(() => roomStore.activePlayer.color || '');
const { user } = useUserStore();
const { logEvent } = useRoom(route.params.id);
const { text, copy } = useClipboard();

function copyLink() {
    copy(`miss.bingo/rooms/join/${route.params.id}`);
    createSnackbar({ type: 'info', message: 'Link copied to clipboard' })
}
//PLAYER
onMounted(async () => {
    console.log('USER VALUE', user.value);
    await initPlayer(user.value);
})

//ROOM_VIEWS
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

//SCORES
const scoreStore = useScoreStore();
const { sortedScoreData, bingos } = storeToRefs(scoreStore);


//BINGO_CARD
const cardDocRef = computed(() => {
    if (roomStore.gameSettings.gameType === 'multi') {
        return doc(db, `rooms/${route.params.id}/cards/${roomStore.activePlayer.cardId}`);
    } else {
        return doc(db, `rooms/${route.params.id}/cards/card`);
    }
})
const cardData = useDocument(cardDocRef);

//[{red:true},{blue:true, red:true}...]
const bingoItemKeys = computed(() => {
    if (cardData.value?.bingoItems) {
        return sortBingoItems(cardData.value.bingoItems);
    } else {
        return [];
    }
})
provide('bingoItemKeys', bingoItemKeys);


//CARD_ACTIONS
const { toggleItemCompletion, focusItem, initPlayer, updatePlayerColor }
    = useLocalRoom(roomStore.roomDocRef, roomStore.activePlayer);
provide('updatePlayerColor', updatePlayerColor);
provide('toggleItemCompletion', toggleItemCompletion);
provide('focusItem', focusItem);



function useLocalRoom(roomDocRef, activePlayer) {

    async function updatePlayerColor(color) {
        try {
            await updateDoc(roomDocRef, {
                [`players.${activePlayer.uuid}.color`]: color
            })
            console.log('NEW COLOR', color);
        } catch (err) {
            console.log(err);
        }
    }

    async function toggleItemCompletion(coordinates) {

        let index = [(coordinates[0] * 5) + coordinates[1]];

        const { scoreBingos, bingoVal } = checkBingo(
            bingos.value,
            cardData.value.bingoItems,
            activePlayer.color,
            index);

        try {
            await updateDoc(doc(db, `rooms/${route.params.id}/scores/scoreBoard`),
                {
                    'bingos': scoreBingos,
                    [`teams.${activePlayer.color}.score`]: increment(bingoVal ? 1 : -1)
                })
            await updateDoc(cardDocRef.value,
                {
                    [`bingoItems.item-${index}.complete`]: bingoVal,
                }
            );
            logEvent('Cell complete', { coordinates: coordinates, player: 'test' });
        } catch (err) {
            console.log(err);
        }
    }

    // update this
    async function focusItem(coordinates, action) {
        let index = [(coordinates[0] * 5) + coordinates[1]];
        if (action === 'add') {
            await updateDoc(cardDocRef.value,
                {
                    [`bingoItems.item-${index}.focusedBy`]: arrayUnion(user.value)
                }
            );
        } else {
            await updateDoc(cardDocRef.value,
                {
                    [`bingoItems.item-${index}.focusedBy`]: arrayRemove(user.value)
                }
            );
        }
    }

    async function initPlayer(uuid) {
        if (!roomStore.roomData.players[uuid]) {
            try {
                await updateDoc(roomStore.roomDocRef, {
                    [`players.${uuid}`]: {
                        joinedOn: serverTimestamp()
                    }
                })
                const roomRef = doc(collection(db, `users/${uuid}/rooms`), route.params.id);
                await setDoc(roomRef, { roomName: roomStore.roomData.roomName, roomId: route.params.id, joinedOn: serverTimestamp() }, { merge: true });
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log('PLAYER EXISTS');
        }
    }
    return { toggleItemCompletion, focusItem, initPlayer, updatePlayerColor }
}


</script>
<style lang="scss">
@use '~/assets/css/01-config/mixins.module.scss';

.bingo-room {
    display: grid;
    grid-template-columns: 1fr;
    --player-color: v-bind(activePlayerColor); //todo:afterIdentifyingPlayer match colour this needs to be a v-bind
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