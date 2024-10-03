<template>
    <div class="room-control-settings">
        <FakeInputList>
            <template #list-data>
                <FakeInput v-for="(item, key) in staticData" :title="key" :data="item"></FakeInput>
            </template>
        </FakeInputList>
        <BaseToggle label="Timer" display="ltr"></BaseToggle>
        <BaseBoolean @change="updateRoomData('hideBoardInitially', roomData.hideBoardInitially)"
            v-model="roomData.hideBoardInitially" label="Hide board initially"></BaseBoolean>
    </div>
</template>
<script setup>
import BaseBoolean from '~/components/base/controls/BaseBoolean.vue';
const roomData = inject('roomData');
const updateRoomData = inject('updateRoomData');
const props = defineProps({ payload: Object });
const staticData = computed(() => {
    let payload = {
        creator: props.payload?.creator.nickname,
        roomType: props.payload?.roomType,
        seed: props.payload?.seed,
        game: props.payload?.game,
        gameMode: props.payload?.gameMode,
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