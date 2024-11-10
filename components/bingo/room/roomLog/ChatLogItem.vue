<template>
    <div class="chat-log-item calaculator-screen-item">
        <PlayerIdHeader :color="roomStore.roomData.players[item.userId].color"
            :nickname="roomStore.roomData.players[item.userId].nickname" :colorChipSize="20">
        </PlayerIdHeader>
        <p class="chat-log-item-message">
            {{ item.message }}
        </p>
    </div>
</template>
<script setup>
import { useRoomStore } from '~/stores/room/roomStore';
const roomStore = useRoomStore();
const props = defineProps({ item: Object });

</script>
<style lang="scss">
.chat-log-item {
    display: grid;
    padding: 0.5rem;
    padding-block-start: 0.75rem;
    grid-template-columns: 1fr;
    background-color: var(--background-color);
    border-block-start: 1px dashed var(--S-30);
    height: max-content;

    &.same-poster {
        border-block-start: 1px dashed transparent;
    }

    &-message {
        margin-top: 0.25rem;

        &:before {
            color: var(--copy-color-muted);
            content: '>> ';
        }
    }

    & .color-selector-button {
        padding: 0.125rem;
    }

    &-timestamp {}
}
</style>