<template>
    <BingoRoom v-if="roomStore.roomData && scoreData" :roomData="roomStore.roomData" :scoreData="scoreData"></BingoRoom>
    <LoaderScreen v-else></LoaderScreen>
</template>
<script setup>
import { doc, collection, setDoc, getDoc, updateDoc, serverTimestamp, FieldValue, increment, addDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useFirestore, useDocument } from "vuefire";
import IconExternalLink from "~/components/icons/IconExternalLink.vue";
import { createSnackbar } from '~/stores/snackbar.js';
import { useRoomStore } from '~/stores/room/roomStore.js';
import { useScoreStore } from "~/stores/room/scoreStore";
definePageMeta({
    title: 'Room',
    linkTitle: `test`,
    order: 1,
    layout: 'room-layout',
})
// Computed room name, with a fallback for 'Secret Room'
const db = useFirestore();
const route = useRoute();
//initialize stores
const roomStore = useRoomStore();
const roomName = computed(() => roomStore.roomData?.roomName || 'Secret Room');
const scoreStore = useScoreStore();
const roomDocRef = computed(() => doc(collection(db, 'rooms'), route.params.id));
const scoresRef = doc(db, `rooms/${route.params.id}/scores/scoreBoard`);
const { data: scoreData } = useDocument(scoresRef);
provide('roomData', roomStore.roomData);
provide('roomDocRef', roomDocRef);
//    middleware: 'check-room-password'
onMounted(() => {
    useHead({
        title: roomName.value,
    });
});
onBeforeMount(() => {
    // roomStore.startListener();
})
onUnmounted(() => {
})
</script>