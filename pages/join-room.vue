<template>
    <main class="join-room">
        <JoinRoomForm></JoinRoomForm>
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
</script>
<style lang="scss"></style>