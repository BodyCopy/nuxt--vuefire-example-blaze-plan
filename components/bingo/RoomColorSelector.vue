<template>
    <div class="room-user-control">
        <!-- {{ player.nickname }} -->
        <BaseButton @click="updatePlayerColor('blue')" btn-style="filled">Blue</BaseButton>
        <BaseButton @click="updatePlayerColor('yellow')" btn-style="filled">Yellow</BaseButton>
        <BaseButton @click="updatePlayerColor('purple')" btn-style="filled">Purple</BaseButton>
    </div>
</template>
<script setup>
// const props = defineProps({ player: { type: Object } });
const updatePlayerColor = inject('updatePlayerColor');


</script>
<style lang="scss"></style>