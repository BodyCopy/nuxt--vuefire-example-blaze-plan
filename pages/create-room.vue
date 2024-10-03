<template>
    <main class="create-room">
        <h1>Create room</h1>
        <KeepAlive>
            <component @custom-template="(e) => { activeComponent = e ? 'Create template' : 'Create room' }"
                :is="components[activeComponent]" @create-room="createRoom"></component>
        </KeepAlive>
        <!-- <CreateRoomForm></CreateRoomForm> -->
    </main>
</template>
<script setup>
import bcrypt from 'bcryptjs';
import CreateRoomForm from '~/components/bingo/CreateRoomForm.vue';
import CustomTemplateForm from '~/components/bingo/CustomTemplateForm.vue';
import { useFirestore } from 'vuefire';
import { addDoc, collection, serverTimestamp, getDoc, doc, setDoc } from 'firebase/firestore';
// Analytics can only be retrieved on the client
definePageMeta({
    linkTitle: 'Create room',
    order: 0,
})
const db = useFirestore();
const user = useCurrentUser();
async function createRoom(data) {
    const roomCollectionRef = collection(db, 'rooms');

    //hash and set password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const { seed, bingoItems, creatorColor, ...roomData } = data;

    const roomRef = await addDoc(roomCollectionRef,
        {
            ...roomData,
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

    const scoreRef = doc(roomRef, `scores/${creatorColor}`);
    await setDoc(scoreRef,
        {
            score: 0,
            bingos: 0,
        },
    );
    const scoreBingoRef = doc(roomRef, 'scores/bingos');
    await setDoc(scoreBingoRef,{
        bingos:['','','','','','','','','','','','']
    });

    console.log('Doc added successfully! :)');
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
    value: '',
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