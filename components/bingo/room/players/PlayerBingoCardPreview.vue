<template>
    <div class="player-bingo-card-preview">
        <div v-for="(item, index) in bingoItemKeys" :class="['bingo-card-preview-item', 'bingo-color', item.complete]">
        </div>
    </div>
</template>
<script setup>
import { doc, collection } from 'firebase/firestore';
import { sortBingoItems } from '~/utilities/bingoUtilities';
const db = useFirestore();
const route = useRoute();
const props = defineProps({ playerCardId: String });
const playerCardRef = doc(db, `rooms/${route.params.id}/cards/${props.playerCardId}`);
const playerBingoItems = useDocument(playerCardRef);
const bingoItemKeys = computed(() => {
    if (playerBingoItems.value?.bingoItems) {
        return sortBingoItems(playerBingoItems.value.bingoItems);
    } else {
        return [];
    }
})
</script>
<style lang="scss">
.player-bingo-card-preview {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    aspect-ratio: 1/1;
    height: 200px;
    gap: 1px;
    background-color: var(--S-30);
    outline: 1px dotted var(--S-30);
    outline-offset: -1px;
    border-radius: 0.5rem;
    overflow: clip;
}

.bingo-card-preview-item {
    background-color: var(--selector-button-color, black);
}
</style>