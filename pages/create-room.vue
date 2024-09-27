<template>
    <main class="create-room">
        <h1>Create room</h1>
        <KeepAlive>
            <component @custom-template="(e) => { activeComponent = e ? 'Create template' : 'Create room' }"
                :is="components[activeComponent]"></component>
        </KeepAlive>
        <!-- <CreateRoomForm></CreateRoomForm> -->
    </main>
</template>
<script setup>
import bcrypt from 'bcryptjs';
import CreateRoomForm from '~/components/bingo/CreateRoomForm.vue';
import CustomTemplateForm from '~/components/bingo/CustomTemplateForm.vue';
// Analytics can only be retrieved on the client
definePageMeta({
    linkTitle: 'Create room',
    order: 0,
})
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