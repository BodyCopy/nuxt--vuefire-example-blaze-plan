<template>
    <div class="room-player-data">
        <Icon name="user" size="16"/><span>{{ playerCount }}</span>/<span>{{ roomPlayerCap }}</span>
    </div>
</template>
<script setup>
const props = defineProps({ roomPlayerCap: Number, playerCount: Number });
</script>
<style lang="scss">
.room-player-data{
    margin-inline-end: -0.5rem;
    margin-block-start: -0.5rem;
    border-radius: 0 0 0 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.9375rem;
    border-block-end: 1px solid var(--S-30);
    border-inline-start: 1px solid var(--S-30);
    padding: 0.25rem 0.25rem;
    width: max-content;
    height: max-content;
    & span{
        margin-top: 0.125rem;
        line-height: 80%;
    }
}
</style>