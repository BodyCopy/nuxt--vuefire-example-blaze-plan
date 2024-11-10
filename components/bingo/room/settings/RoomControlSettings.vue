<template>
    <div class="room-control-settings">
        <FakeInputList>
            <template #list-data>
                <FakeInput v-for="(item, key) in staticData" :title="key" :data="item"></FakeInput>
            </template>
        </FakeInputList>
        <BaseBoolean @change="updateRoomData('hideBoardInitially', roomStore.roomData.hideBoardInitially)"
            v-model="roomStore.roomData.hideBoardInitially" label="Hide board initially"></BaseBoolean>
        <BaseBoolean @change="updateRoomData('hasTimer', roomStore.roomData.hasTimer)"
            v-model="roomStore.roomData.hasTimer" label="Show timer">
        </BaseBoolean>
        <BaseButton v-if="roomStore.roomData.creator.uid === user">New board</BaseButton>
        <BaseButton v-if="roomStore.roomData.creator.uid === user" @click="regenerateCards">Regenerate boards
        </BaseButton>
        <BaseButton v-if="roomStore.roomData.creator.uid === user" @click="resetCards">Reset boards</BaseButton>
    </div>
</template>
<script setup>
import BaseBoolean from '~/components/base/controls/BaseBoolean.vue';
import { useCreateRoom } from '~/composables/useCreateRoom';
import { useScoreBoard } from '~/composables/useScoreBoard.js';
import { useRoomStore } from '~/stores/room/roomStore.js';
import { useUserStore } from '~/stores/userStore.js';
import { useSnackbar } from '~/composables/useSnackbar';
const { createSnackbar } = useSnackbar();
const { user } = useUserStore();
const { newBingoCards, resetBingoCards } = useCreateRoom();
const { resetAllScores } = useScoreBoard();
async function regenerateCards() {
    try {
        await newBingoCards(route.params.id, roomStore.roomData.template);
        createSnackbar({ type: 'success', message: 'New cards generated!' });
    } catch (err) {
        console.log(err);
    }
}
async function resetCards() {
    try {
        await resetBingoCards(route.params.id);
        createSnackbar({ type: 'success', message: 'Reset successful!' });
    } catch (err) {
        console.log(err);
    }
}
const roomData = inject('roomData');
const route = useRoute();
const roomStore = useRoomStore();
const { updateRoomData } = useRoomStore();
const props = defineProps({ payload: Object });
const staticData = computed(() => {
    let payload = {
        creator: roomStore.roomData.creator.nickname,
        roomType: roomStore.roomData.roomType,
        seed: roomStore.roomData.seed,
        game: roomStore.roomData.game,
        gameMode: roomStore.roomData.gameMode,
        gameType: roomStore.roomData.gameType
    };
    // Use Object.entries to convert the object into key-value pairs
    payload = Object.entries(payload)
        // Filter out entries where the value is undefined or null
        .filter(([_, val]) => val !== undefined && val !== null);
    // Convert the filtered entries back into an object
    payload = Object.fromEntries(payload);

    return payload;
})
</script>
<style lang="scss">
.room-control-settings {
    border: 1px solid var(--S-30);
}
</style>