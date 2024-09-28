<template>
    <main class="join-room">
        <JoinRoomForm @join-room="joinRoom"></JoinRoomForm>
    </main>
</template>
<script lang="ts" setup>

// Analytics can only be retrieved on the client
const user = useCurrentUser()

definePageMeta({
    title: 'Join room',
    linkTitle: 'Join room',
    order: 0,
})
async function joinRoom(data: any) {
    console.log(data);
}
</script>
<style lang="scss"></style>