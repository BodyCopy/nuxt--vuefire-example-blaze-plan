<template>
    <div class="profile">
        <ProfileBingoRooms :rooms="userRooms"></ProfileBingoRooms>
        <ProfileBingoTemplates :templates="userTemplates"></ProfileBingoTemplates>
        <button @click="() => {
            console.log(userRooms);
        }">Room Data</button>
    </div>
</template>
<script setup>
import { useUserData } from '~/stores/userData';
definePageMeta({
    title: 'Profile',
    linkTitle: `profile`,
    order: 1,
    layout: 'room-layout'
})
const route = useRoute();
const userId = route.params.id;
const { userTemplates, userRooms } = useUserData(userId);
// const thisUser = inject('user');
// const thisUser = user.value;

</script>
<style lang="scss"></style>