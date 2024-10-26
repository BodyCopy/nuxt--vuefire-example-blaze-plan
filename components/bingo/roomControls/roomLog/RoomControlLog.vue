<template>
    <div class="room-control-log">
        <BaseButtonSet v-model="logView.value" :options="logView.options" width="fc"></BaseButtonSet>
        <component class="room-log" :is="logViewComponents[logView.value]">
        </component>
        <div v-if="logView.value === 'chat'" class="room-control-log-chat-input">
            <BaseInput v-model="chatMessage" @keydown.enter="postMessage" placeholder="-type message-"
                style="font-size:16px"></BaseInput>
            <IconSend />
        </div>
    </div>
</template>
<script setup>
import { useUserData } from '~/stores/userData';
import { push, ref as rtdRef, serverTimestamp } from 'firebase/database';
import ChatLog from './ChatLog.vue';
import EventLog from './EventLog.vue';

const db = useDatabase();
const route = useRoute();
const { user } = useUserData();
const logView = reactive({
    options: { 'Chat': 'chat', 'Event Log': 'event' },
    value: 'chat'
})
const logViewComponents = {
    'event': EventLog,
    'chat': ChatLog
}

const roomId = route.params.id;
const roomLogRef = rtdRef(db, `rooms/${roomId}/chat`);

const chatMessage = ref('');
async function postMessage() {
    chatMessage.value = chatMessage.value.trim();
    if (chatMessage.value.length < 1) {
        return;
    }
    try {
        await push(roomLogRef, {
            message: chatMessage.value,
            userId: user.value,
            timestamp: serverTimestamp()
        }
        )
        console.log('message sent successfully');
        chatMessage.value = ''
    } catch (err) {
        console.log('error', err);
    }
}
</script>
<style lang="scss">
.room-control-log {
    position: relative;
    min-height: calc(90dvh - var(--room-control-header-height) - 1.5rem);
    max-height: calc(90dvh - var(--room-control-header-height) - 1.5rem);
    display: grid;
    grid-template-rows: max-content 1fr max-content;
    gap: 0.5rem;

    &-chat-input {
        display: grid;
        gap: 0.5rem;
        position: sticky;

        &>.feather-send {
            right: 0.5rem;
            top: 50%;
            transform: translateY(-50%);
            position: absolute;
            height: 1.5rem;
            width: auto;
            aspect-ratio: 1/1;
        }
    }
}

.room-log {
    overflow-y: auto;
    display: grid;
    margin-block-start: auto;
    max-height: 100%;
}
</style>