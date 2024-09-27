<template>
    <li class="room-line-item line-item">
        <NuxtLink v-if="link" :to="`rooms/${room.id}`" class="room-line-item">
            <Icon name="arrow-right" size="24" />
            <!-- <div class="room-line-item__data">
                <h5>{{ room.title || 'Anon room' }}</h5>
                <dl class="room-line-item__data-meta">
                    <dt>C</dt>
                    <dd>{{ room.creator.displayName || 'Anon creator' }}</dd>
                    <dt>G</dt>
                    <dd>{{ room.game || 'Anon game' }}</dd>
                </dl>
            </div> -->
            <LineItemData :creator="room.creator.displayName" :title="room.title" :game="room.game"></LineItemData>
            <RoomPlayersData room-player-cap="8" :player-count="playerCount" />
        </NuxtLink>
        <div v-else class="room-line-item">
            <Icon name="arrow-right" size="24" />
            <LineItemData :creator="room.creator" :title="room.title" :game="room.game"></LineItemData>
            <RoomPlayersData room-player-cap="8" :player-count="playerCount" />
        </div>
    </li>
</template>
<script setup>
import LineItemData from './LineItemData.vue';

const props = defineProps({ room: Object, link: Boolean });
const playerCount = computed(() => {
    return Object.entries(props.room.players).length;
})
</script>
<style lang="scss">
.line-item {
    background-color: var(--S-40);
    border-block-end: 1px dashed var(--S-30);
    padding: 0.5rem;
    gap: 0.5rem;
}

.room-line-item {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
}

.room-player-data {
    align-self: start;
}
</style>