<template>
    <div class="content create-room">
        <div class="create-room-form  calculator-screen">
            <KeepAlive>
                <component @custom-template="handleCustomTemplate" :is="components[activeComponent]"
                    @create-room="createAndNavigateToRoom"></component>
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

import CreateRoomForm from '~/components/bingo/form/CreateRoomForm.vue';
import CustomTemplateForm from '~/components/bingo/form/CustomTemplateForm.vue';
import { useFirestore } from 'vuefire';
import { useCreateRoom } from '~/composables/useCreateRoom.js';
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
const { createRoom } = useCreateRoom();
async function createAndNavigateToRoom(payload) {
     //hash and set password
     payload.password = await bcrypt.hash(payload.password, 10);
    try {
        await createRoom(payload);
        router.push(`/rooms/${roomCode}`);
    } catch (err) {
        console.log(err);
        alert(err);
    }
}
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