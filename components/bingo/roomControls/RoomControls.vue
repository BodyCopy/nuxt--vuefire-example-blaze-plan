<template>
    <div class="room-controls">
        <RoomControlHeader></RoomControlHeader>
        <component :is="controls[selectedTab]"></component>
    </div>
</template>
<script setup>
import RoomControlPlayer from './RoomControlPlayer.vue';
import RoomControlSettings from './RoomControlSettings.vue';
const selectedTab = ref('Player');
const controls =
{
    Settings: RoomControlSettings,
    Player: RoomControlPlayer
}
</script>
<style lang="scss">
.room-controls {
    --room-control-height: 3rem;
    border-block-start: 1px solid var(--S-30);
    border-inline: 1px solid var(--S-30);
    border-radius: 0.25rem 0.25rem 0 0;
    position: fixed;
    height: var(--room-control-height);
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--background-color);
    z-index: 4;
}
</style>