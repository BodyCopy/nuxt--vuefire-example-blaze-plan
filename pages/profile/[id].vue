<template>
    <div class="profile">
        <ProfileBingoRooms :rooms="userRooms"></ProfileBingoRooms>
        <ProfileBingoTemplates :templates="userTemplates"></ProfileBingoTemplates>
        <button @click="() => {
            console.log(userTemplates);
        }">Room Data</button>
    </div>
</template>
<script setup>
import {
    query,
    collection,
    where
} from 'firebase/firestore'
definePageMeta({
    title: 'Profile',
    linkTitle: `profile`,
    order: 1,
    layout: 'default'
})
const route = useRoute();
const userId = route.params.id;

const { userTemplates, userRooms } = useProfileData(userId);

function useProfileData(userId) {
    const db = useFirestore();
    const templateCollectionRef = collection(db, 'templates');
    const templateQuery = query(templateCollectionRef, where('creator.uid', '==', userId));
    const userTemplates = useCollection(templateQuery); // Fetch and bind data
    const userRoomsRef = collection(db, `users/${userId}/rooms`);
    const userRooms = useCollection(userRoomsRef); // Fetch and bind data

    return { userTemplates, userRooms };
};

// const thisUser = inject('user');
// const thisUser = user.value;

</script>
<style lang="scss"></style>