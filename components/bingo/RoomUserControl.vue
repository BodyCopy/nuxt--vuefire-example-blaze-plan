<template>
    <div class="room-user-control">
        {{ creator }}
        <BaseButton @click="updatePlayerColor('blue')" btn-style="filled">Blue</BaseButton>
        <BaseButton @click="updatePlayerColor('yellow')" btn-style="filled">Yellow</BaseButton>
        <BaseButton @click="updatePlayerColor('purple')" btn-style="filled">Purple</BaseButton>
    </div>
</template>
<script setup>
const props = defineProps({ creator: { type: String } });
const updatePlayerColor = inject('updatePlayerColor');


</script>
<style lang="scss"></style>