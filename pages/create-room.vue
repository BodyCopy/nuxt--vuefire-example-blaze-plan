<template>
    <div class="content create-room">
        <div class="create-room-form  calculator-screen">
            <KeepAlive>
                <component @custom-template="handleCustomTemplate" :is="components[activeComponent]"
                    @create-room="createRoom"></component>
            </KeepAlive>
        </div>
        <div v-if="activeComponent === 'Create room'" class="form-action-bar">
            <BaseButton btnStyle="filled">Test</BaseButton>
        </div>
        <div v-else-if="activeComponent === 'Create template'" class="form-action-bar">
            <BaseButton btnStyle="filled">Template</BaseButton>
        </div>
        <!-- <CreateRoomForm></CreateRoomForm> -->
    </div>
</template>
<script setup>
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import CreateRoomForm from '~/components/bingo/CreateRoomForm.vue';
import CustomTemplateForm from '~/components/bingo/CustomTemplateForm.vue';
import { useFirestore } from 'vuefire';
import { addDoc, collection, serverTimestamp, getDoc, doc, getDocs, query, where, setDoc, runTransaction } from 'firebase/firestore';
// Analytics can only be retrieved on the client
definePageMeta({
    title: 'Create room',
    linkTitle: 'Create room',
    order: 0,
    layout: 'room-form'
})
const route = useRoute();
const router = useRouter();
const db = useFirestore();
const user = useCurrentUser();
function handleCustomTemplate(data) {
    if (data) {
        router.push({ query: { 'custom-template': 12345 } });
        activeComponent.value = 'Create template'
    } else {
        router.push({ query: null });
        activeComponent.value = 'Create room'
    }
}
onMounted(() => {
    if (route.query['custom-template']) {
        activeComponent.value = 'Create template';
    }
})

async function createRoom(data) {

    //hash and set password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const { seed, bingoItems, creatorColor, ...roomData } = data;


    async function generateUniqueRoomCode() {
        let roomCode;
        let isUnique = false;
        let roomCollectionRef = collection(db, 'rooms');
        while (!isUnique) {
            roomCode = uuidv4().slice(0, 4); // Extract first 6 characters from UUID
            const docRef = doc(roomCollectionRef, roomCode);
            const docSnapshot = await getDoc(docRef);
            isUnique = !docSnapshot.exists(); // Ensure uniqueness
        }

        return roomCode;
    }
    const roomCode = await generateUniqueRoomCode();
    const newRoomRef = doc(db, `rooms/${roomCode}`);

    const roomRef = await setDoc(newRoomRef,
        {
            ...roomData,
            roomCode: roomCode,
            password: hashedPassword,
            createdOn: serverTimestamp(),
            lastUsedOn: serverTimestamp(),
        }
    )

    let cardsRef;
    if (roomData.gameType === 'multi') {
        cardsRef = doc(newRoomRef, `cards/${creatorColor}-card`);
    } else {
        cardsRef = doc(newRoomRef, 'cards/card');
    }
    //this you will need to reuse if you want to generate cards on the fly
    await setDoc(cardsRef,
        {
            bingoItems: bingoItems,
            players: {
                [user.value.uid]: {
                    nickname: data.creator.nickname,
                }
            },
            createdOn: serverTimestamp(),
            lastUsedOn: serverTimestamp(),
            seed: seed
        }
    );

    const scoreBoardRef = doc(newRoomRef, 'scores/scoreBoard');

    await runTransaction(db, async (transaction) => {
        const scoreBoardDoc = await transaction.get(scoreBoardRef);

        if (!scoreBoardDoc.exists() || !scoreBoardDoc.data().teams[data.creatorColor]) {
            // Field doesn't exist, so initialize it
            transaction.set(scoreBoardRef, {
                bingos: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                teams: {
                    [data.creatorColor]: { players: [user.value.uid], score: 0 }
                }
            }, { merge: true }); // Use merge to avoid overwriting other fields
        }
    });

    console.log('Doc added successfully! :)');

    router.push(`/rooms/${roomCode}`);
    //error
    // Uncaught (in promise) TypeError: can't access property "players", roomData.value is undefined
}

const components =
{
    'Create room': CreateRoomForm,
    'Create template': CustomTemplateForm
}
const activeComponent = ref('Create room');


</script>
<style lang="scss">
.create-room-form {
    overflow-y: scroll;
}
</style>