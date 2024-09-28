<template>
    <div class="room-details">
        <h5>{{ roomData.roomName }}</h5>
        <RoomUserControl :creator="roomData.creator"></RoomUserControl>
        <RoomData :seed="roomData.seed"></RoomData>
        <RoomScore :score="roomData.score"></RoomScore>
    </div>
</template>
<script setup>
const props = defineProps({ roomData: { type: Object } });
</script>
<style lang="scss"></style>