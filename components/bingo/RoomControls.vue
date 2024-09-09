<template>
    <div class="room-controls">
        <h5>{{roomData.title}}</h5>
        <RoomUserControl :creator="roomData.creator"></RoomUserControl>
        <RoomData :seed="roomData.seed"></RoomData>
        <RoomScore :score="roomData.score"></RoomScore>
    </div>
</template>
<script setup>
import { useRoomStore } from '~/stores/roomData';
const route = useRoute();
const id = route.params.id;
const { roomData } = useRoomStore(id);
</script>
<style lang="scss"></style>