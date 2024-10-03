<template>
    <h1>Join {{ roomId }}</h1>
    <JoinRoomForm @join-room="joinRoom"></JoinRoomForm>
</template>
<script setup>
import { useRoom } from '~/composables/useRoom';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
const user = useCurrentUser();
const { getRandomizedCardFromTemplate } = useRoom();
const route = useRoute();
const roomId = computed(() => route.params.id);
const db = useFirestore();
const roomRef = doc(db, `rooms/${route.params.id}`);
const roomData = useDocument(roomRef);

async function joinRoom(data) {
    console.log('join room');

    let cardId = 'card';

    //if multicard format create a new card and add it to the cards collection
    //in multi card cards are labeled {color}-card
    //this means there is a maximum of 8 players
    if (roomData.value.gameType === 'multi') {
        let cardId = `${data.playerColor}-card`
        const newCardRef = doc(roomRef, `cards/${cardId}`);
        const { newCard, seed } = await getRandomizedCardFromTemplate(roomData.value.template);
        await setDoc(newCardRef, {
            bingoItems: newCard,
            players: {
                [user.value.uid]: {
                    nickname: data.nickname
                }
            },
            seed: seed,
            createdOn: serverTimestamp()
        })
    }

    //add player to the room document
    await updateDoc(roomRef, {
        [`players.${user.value.uid}`]: {
            nickname: data.nickname,
            color: data.playerColor,
            cardId: cardId
        }
    })
    const scoreRef = doc(roomRef, `scores/${data.playerColor}`);
    //check if doc exists;
    await setDoc(scoreRef, {}, { merge: true });
    console.log('join', data);
}
</script>