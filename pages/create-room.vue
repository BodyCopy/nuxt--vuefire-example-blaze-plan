<template>
    <main class="create-room">
        <KeepAlive>
            <component @custom-template="handleCustomTemplate" :is="components[activeComponent]"
                @create-room="createRoom"></component>
        </KeepAlive>
        <!-- <CreateRoomForm></CreateRoomForm> -->
    </main>
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
    const roomCollectionRef = collection(db, 'rooms');

    //hash and set password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const { seed, bingoItems, creatorColor, ...roomData } = data;

    async function generateUniqueRoomCode() {
        const roomCodesRef = collection(db, 'rooms');
        let roomCode;
        let isUnique = false;

        while (!isUnique) {
            roomCode = uuidv4().slice(0, 6); // Extract first 6 characters from UUID
            const querySnapshot = await getDocs(query(roomCodesRef, where('code', '==', roomCode)));
            isUnique = querySnapshot.empty; // Ensure uniqueness
        }

        return roomCode;
    }

    const roomCode = await generateUniqueRoomCode();

    const roomRef = await addDoc(roomCollectionRef,
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
        cardsRef = doc(roomRef, `cards/${creatorColor}-card`);
    } else {
        cardsRef = doc(roomRef, 'cards/card');
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

    const scoreBoardRef = doc(roomRef, 'scores/scoreBoard');

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

    router.push(`/rooms/${roomRef.id}`);
    //error
    // Uncaught (in promise) TypeError: can't access property "players", roomData.value is undefined
}

const components =
{
    'Create room': CreateRoomForm,
    'Create template': CustomTemplateForm
}
const activeComponent = ref('Create room');

const roomName = reactive({
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: ''
})
const password = reactive({
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: ''
})
const nickname = reactive({
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: ''
})
const game = reactive({
    value: 'elden ring',
    validated: true,
    errorText: 'Invalid',
    pattern: '',
    custom: false
})
const template = reactive({
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: '',
    custom: false
})
const gameType = reactive({
    options: { Single: 'single', 'Multi-card': 'multi' },
    value: 'single',
    validated: true,
    errorText: 'Invalid',
    pattern: '',
})
const gameMode = reactive({
    options: { Standard: 'standard', 'Lock-out': 'lockOut' },
    value: 'standard',
    validated: true,
    errorText: 'Invalid',
    pattern: '',
})
const seed = reactive({
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: ''
})
const playerColor = reactive({
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: ''
})


const hideBoardInitially = ref(false);
</script>
<style lang="scss"></style>