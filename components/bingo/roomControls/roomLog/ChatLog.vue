<template>
    <div class="chat-log-container">
        <div ref="chatLogElement" class="chat-log-feed room-log">
            <ChatLogItem v-for="(item, index) of log" :key="item.id" :item="item"></ChatLogItem>
        </div>
        <div class="chat-log-chat-input">
            <BaseInput v-model="chatMessage" @keydown.enter="postMessage" placeholder="-type message-"
                style="font-size:16px"></BaseInput>
            <IconSend />
        </div>
    </div>
</template>
<script setup>
import { push, ref as rtdRef, serverTimestamp } from 'firebase/database';
import { humanReadableDate } from '~/composables/dateUtilities';
import ChatLogItem from './ChatLogItem.vue';
import { useMutationObserver } from '@vueuse/core';
import { useRoomStore } from '~/stores/room/roomStore';
import { useUserStore } from '~/stores/userStore.js';
const { user } = useUserStore();
const roomStore = useRoomStore();
const chatLogElement = ref(null);

useMutationObserver(chatLogElement, (mutations) => {
    if (!mutations) {
        return;
    }
    const element = chatLogElement.value;
    const isNearBottom = (element.scrollHeight - element.scrollTop - element.clientHeight) < 80;

    if (isNearBottom) {
        element.scrollTo({
            top: element.scrollHeight,
            behavior: 'smooth'
        });
    }

}, { childList: true });
const date = (timestamp) => {
    return humanReadableDate(timestamp);
}
const db = useDatabase();
const route = useRoute();
const roomLogRef = rtdRef(db, `rooms/${route.params.id}/chat`);
const log = useDatabaseList(roomLogRef);
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
// Function to determine if it's the same poster
const shouldShowSamePoster = (index, item) => {
    return index === 0 || log.value[index - 1].userId !== item.userId;
};

onMounted(async () => {
    await nextTick()
    chatLogElement.value.scrollTo({
        top: chatLogElement.value.scrollHeight,
        behavior: 'smooth'
    });
})
</script>
<style lang="scss">
.chat-log {
    &-container {
        display: grid;
        grid-template-rows: 1fr max-content;
    }

    &-feed {
        overflow-y: auto;
        display: grid;
        margin-block-start: auto;
        max-height: 100%;
    }

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
</style>