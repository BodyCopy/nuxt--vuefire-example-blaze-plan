<template>
    <h2>Active rooms</h2>
    <LineItemGrid>
        <template #grid-items>
            <RoomLineItem v-for="room in activeRooms" :link="true" :room="room"></RoomLineItem>
        </template>
    </LineItemGrid>
</template>
<script setup>
import { collection } from 'firebase/firestore';

definePageMeta({
    linkTitle: 'Active rooms',
    order: 1,
})
const db = useFirestore();

const activeRoomsRef = collection(db,'rooms');
const activeRooms = useCollection(activeRoomsRef);//todo this will update to much

</script>
<style lang="scss"></style>