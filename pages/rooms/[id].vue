<template>
    <BingoRoom v-if="roomData && scoreData" :roomData="roomData" :scoreData="scoreData"></BingoRoom>
    <LoaderScreen v-else></LoaderScreen>
</template>
<script setup>
import { doc, collection, setDoc, getDoc, updateDoc, serverTimestamp, FieldValue, increment, addDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useFirestore, useDocument } from "vuefire";
import IconExternalLink from "~/components/icons/IconExternalLink.vue";
import { createSnackbar } from '~/stores/snackbar.js';
import { useUserData } from "~/stores/userData";
definePageMeta({
    title: 'Room',
    linkTitle: `test`,
    order: 1,
    layout: 'room-layout',
})
const db = useFirestore();
const route = useRoute();
const roomDocRef = computed(() => doc(collection(db, 'rooms'), route.params.id));
const { data: roomData } = useDocument(roomDocRef);
const scoresRef = doc(db, `rooms/${route.params.id}/scores/scoreBoard`);
const { data: scoreData } = useDocument(scoresRef);
provide('roomData', roomData);
provide('roomDocRef', roomDocRef);
//    middleware: 'check-room-password'
</script>