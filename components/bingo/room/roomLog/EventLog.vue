<template>
    <div class="event-log room-log">
        <EventLogItem v-for="item in log" :item="item"></EventLogItem>
    </div>
</template>
<script setup>
import { push, ref as rtdRef, serverTimestamp } from 'firebase/database';
const db = useDatabase();
const route = useRoute();
const roomId = route.params.id;
const roomLogRef = rtdRef(db, `rooms/${roomId}/event`);
const log = useDatabaseList(roomLogRef);
</script>
<style lang="scss"></style>