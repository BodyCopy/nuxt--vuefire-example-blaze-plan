<template>
    <div class="bingo-room">
        <BingoCard :bingo-items="bingoItemKeys"></BingoCard>
        <RoomControls></RoomControls>
    </div>
</template>
<script setup>
import { doc, getDoc, collection, updateDoc } from 'firebase/firestore';
definePageMeta({
    title: 'Room',
    linkTitle: `test`,
    order: 1,
    layout: 'room-layout'
})
const route = useRoute();
const id = route.params.id;
const db = useFirestore();

const room = computed(() =>
    doc(collection(db, 'rooms'), id)
)
// contact will always be in sync with the data source
const roomData = useDocument(room);

const bingoItemKeys = computed(() => {
    const orderedItems = Object.keys(roomData.value.bingoItems)
        .sort((a, b) => {
            // Extract the number from the key and compare numerically
            const numA = parseInt(a.replace('item', ''), 10);
            const numB = parseInt(b.replace('item', ''), 10);
            return numB - numA;
        })
        .map(key => roomData.value.bingoItems[key]); // Convert sorted keys back to array of objects
    console.log('ORDERED', orderedItems);
    return orderedItems;
})

const docRef = doc(db, `rooms/${id}`);

async function updateBingoItem(itemId, key, value) {
    try {
        await updateDoc(docRef, {
            [`bingoItems.item-${itemId}.${key}`]: value
        });
        console.log('success');
    } catch (err) {
        console.log(err);

    }
}
</script>
<style lang="scss">
.bingo-room {
    display: grid;
    grid-template-columns: max-content 1fr;
}
</style>