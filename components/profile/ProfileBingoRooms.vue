<template>
    <div>
        <h2>Rooms:</h2>
        <ul v-if="rooms">
            <li v-for="data in rooms">
                <NuxtLink :to="{ name: 'rooms-id', params: { id: data.roomId } }">{{ data?.roomTitle ||
                    'Anon room' }}</NuxtLink>
            </li>
        </ul>
    </div>
</template>
<script setup>
import { useIsCurrentUserLoaded } from 'vuefire';
import { useUserData } from '~/stores/userData';
const props = defineProps({ rooms: { type: Array } });
// const { userRooms } = useUserData();


</script>
<style lang="scss"></style>