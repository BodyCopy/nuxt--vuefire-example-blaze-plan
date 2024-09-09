<template>
    <div class="room-user-control">
        {{ creator }}
        <button @click="() => {
            console.log(user);
        }">Who Am I</button>
    </div>
</template>
<script setup>
const props = defineProps({ creator: { type: String } });
const user = useCurrentUser();

</script>
<style lang="scss"></style>