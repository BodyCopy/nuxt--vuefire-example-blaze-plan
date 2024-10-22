<template>
    <div ref="chatLogElement" class="chat-log">
        <ChatLogItem v-for="(item, index) of log" :key="item.id" :item="item"></ChatLogItem>
    </div>
</template>
<script setup>
import { useUserData } from '~/stores/userData';
import { push, ref as rtdRef, serverTimestamp } from 'firebase/database';
import { humanReadableDate } from '~/composables/dateUtilities';
import ChatLogItem from './ChatLogItem.vue';
import { useMutationObserver } from '@vueuse/core';
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
const roomId = route.params.id;
const roomLogRef = rtdRef(db, `rooms/${roomId}/chat`);
const log = useDatabaseList(roomLogRef);
const roomData = inject('roomData');
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
<style lang="scss"></style>