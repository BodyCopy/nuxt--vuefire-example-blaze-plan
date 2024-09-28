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
import { addDoc, collection, serverTimestamp, getDoc, doc } from 'firebase/firestore';
// Analytics can only be retrieved on the client
definePageMeta({
    linkTitle: 'Create room',
    order: 0,
})
const db = useFirestore();
async function createRoom(data) {
    console.log(data);
    const roomCollectionRef = collection(db, 'rooms');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const templateRef = doc(db, 'templates', data.template);
    const bingoItemsSnapshot = await getDoc(templateRef);
    const bingoItemsObject = {}
    let bingoItems = bingoItemsSnapshot.data().bingoItems;
    //randomize array
    for (let i = 0; i <= 24; i++) {
        let bi = bingoItems[i];
        bingoItemsObject[`item-${i}`] = { name: bi, complete: '' };
    }
    //save as 25 item keyvalue pair
    await addDoc(roomCollectionRef,
        {
            ...data,
            bingoItems: bingoItemsObject,
            password: hashedPassword,
            createdOn: serverTimestamp(),
            lastUsedOn: serverTimestamp(),

        }
    )
    console.log('Doc added successfully! :)');

    //to create a room I need to
    //addDoc
    //include all payload info
    //get response id
    //if successful
    //route to room
    //if fail??
}
const user = useCurrentUser()
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