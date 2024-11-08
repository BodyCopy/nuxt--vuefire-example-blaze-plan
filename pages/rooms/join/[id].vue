<template>
    <div class="join-room-page">
        <!-- <FakeInputList heading="Room details">
            <template #list-data>
                <FakeInput title="Name" :data="roomData?.roomName"></FakeInput>
                <FakeInput title="Code" :data="roomData?.roomCode"></FakeInput>
                <FakeInput title="Creator" :data="roomData?.creator.nickname"></FakeInput>
                <FakeInput title="Max team size" :data="roomData?.teamSizes"></FakeInput>
            </template>
        </FakeInputList> -->
        <JoinRoomForm @join-room="joinRoom" :roomData></JoinRoomForm>
    </div>
</template>
<script setup>
import { useRoom } from '~/composables/useRoom';
import { doc, collection, query, serverTimestamp, setDoc, getDoc, updateDoc, runTransaction, where, arrayUnion } from 'firebase/firestore';
definePageMeta({
    title: `Join room`,
    linkTitle: `join-room`,
    order: 1,
    layout: 'room-form'
})


const user = useCurrentUser();

const { getRandomizedCardFromTemplate } = useRoom();
const route = useRoute();
const router = useRouter();
const roomId = computed(() => route.params.id);
const db = useFirestore();
const roomRef = doc(db, `rooms/${route.params.id}`);
const roomData = useDocument(roomRef);

async function joinRoom(data) {
    console.log('join room');
    if (data.existingPlayer) {
        router.push(`/rooms/${route.params.id}`);
        return;
    }

    let cardId = 'card';

    //if multicard format create a new card and add it to the cards collection
    //in multi card cards are labeled {color}-card
    //this means there is a maximum of 8 players
    try {
        if (roomData.value.gameType === 'multi') {
            cardId = `${data.playerColor}-card`
            const newCardRef = doc(roomRef, `cards/${cardId}`);
            //check if card exists
            const checkIfCardExists = await getDoc(newCardRef);
            if (!checkIfCardExists.exists()) {
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
            } else {
                await setDoc(newCardRef, {
                    players: {
                        [user.value.uid]: {
                            nickname: data.nickname
                        }
                    },
                }, { merge: true })
            }
        }

        //add player to the room document
        await updateDoc(roomRef, {
            [`players.${user.value.uid}`]: {
                nickname: data.nickname,
                color: data.playerColor,
                cardId: cardId
            }
        })
        const scoreBoardRef = doc(roomRef, `scores/scoreBoard`);
        //check if doc exists;
        await runTransaction(db, async (transaction) => {
            const scoreBoardDoc = await transaction.get(scoreBoardRef);

            if (!scoreBoardDoc.exists() || !scoreBoardDoc.data().teams[data.playerColor]) {
                // Field doesn't exist, so initialize it
                transaction.set(scoreBoardRef, {
                    teams: {
                        [data.playerColor]: { players: [user.value.uid], score: 0 }
                    }
                }, { merge: true }); // Use merge to avoid overwriting other fields
            } else {
                // Retrieve the current players array
                const currentPlayers = scoreBoardDoc.data().teams[data.playerColor].players || [];

                // Check if the player is already in the array
                if (!currentPlayers.includes(user.value.uid)) {
                    transaction.update(scoreBoardRef, {
                        [`teams.${data.playerColor}.players`]: arrayUnion(user.value.uid)
                    });
                }
            }
        });
        // await setDoc(scoreRef, {
        //     teams: {
        //         [data.playerColor]: { players: [user.value.uid] }
        //     }
        // }, { merge: true });
        console.log('join', data);
        router.push(`/rooms/${route.params.id}`);
    } catch (err) {
        console.log(err);

    }
}
</script>