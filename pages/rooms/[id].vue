<template>
    <div class="bingo-room">
        <div>
            <h5>{{ roomData.roomName }}</h5>
            <BingoCard :bingo-items="bingoItemKeys" :bingos="bingos"></BingoCard>
        </div>
        <div>
            <p>BINGOS{{ bingos }}</p>
            <RoomDetails :roomData="roomData"></RoomDetails>
            <p>{{ player.color }}</p>
        </div>
        <RoomControls></RoomControls>
    </div>
</template>
<script setup>
import { doc, collection, setDoc, getDoc, updateDoc, serverTimestamp, FieldValue, increment, addDoc } from "firebase/firestore";
import { useFirestore, useDocument } from "vuefire";
definePageMeta({
    title: 'Room',
    linkTitle: `test`,
    order: 1,
    layout: 'room-layout',
})
//    middleware: 'check-room-password'
const db = useFirestore();
const route = useRoute();
// const roomId = computed(() => route.params.id);
const user = useCurrentUser();
const roomDocRef = computed(() => doc(collection(db, 'rooms'), route.params.id));
const roomData = useDocument(roomDocRef);
const gameMode = computed(() => roomData.value.gameMode);
const player = computed(() => {
    if (user.value) {
        return { ...roomData.value.players[user.value.uid], uuid: user.value.uid }
    } else {
        return {};
    }
});
const bingos = computed(() => roomData.value.score.bingos);
const bingoItemKeys = computed(() => {
    if (roomData) {
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
    } else {
        return null;
    }
})
const { toggleItemCompletion, initPlayer, updatePlayerColor } = useRoom();

provide('updatePlayerColor', updatePlayerColor);
provide('toggleItemCompletion', toggleItemCompletion);

onMounted(async () => {
    await getCurrentUser();
    console.log('USER VALUE', user.value);
    await initPlayer(user.value.uid);
})


async function checkPassword() {
    // Your logic
}







function useRoom() {
    const bingoLines = (() => { return getBingoLines() })();
    async function updatePlayerColor(color) {
        try {
            await updateDoc(roomDocRef.value, {
                [`players.${player.value.uuid}.color`]: color
            })
            console.log('NEW COLOR', color);

        } catch (err) {
            console.log(err);
        }
    }
    async function toggleItemCompletion(coordinates) {
        const items = roomData.value.bingoItems;
        const bingos = roomData.value.score.bingos;

        let scoreBingos = JSON.parse(JSON.stringify(bingos));
        // Toggle the completion state of the clicked item
        let index = [(coordinates[0] * 5) + coordinates[1]];

        let val = '';
        if (roomData.value.bingoItems[`item-${index}`].complete === '') {
            val = player.value.color;
        } else if (roomData.value.bingoItems[`item-${index}`].complete === player.value.color) {
            val = '';
        } else {
            return;
        }
        // Update the local state of the item
        items[`item-${index}`].complete = val;  // Update the completion state locally

        // Check for any completed or uncompleted bingos

        try {
            ///////////////
            // Iterate over all possible bingo lines (rows, columns, diagonals)
            for (const [bingoIndex, line] of bingoLines.entries()) {
                // Get the color of the first item in the line to compare with others
                const firstItemColor = items[`item-${line[0]}`].complete;

                // Check if all items in the line have the same non-empty color
                const isComplete = firstItemColor !== '' && line.every(i => items[`item-${i}`].complete === firstItemColor);

                // If the line is complete and not yet marked as bingo, mark it
                if (isComplete && !bingos[bingoIndex]) {
                    scoreBingos[bingoIndex] = player.value.color; // Mark the line as bingo
                }
                // If the line was marked as bingo but is now incomplete, unmark it
                else if (!isComplete && bingos[bingoIndex]) {
                    scoreBingos[bingoIndex] = ''; // Unmark the line as bingo
                }
            }

            // Update bingos only once after all checks
            console.log('SCORE BINGOS', scoreBingos);

            await updateDoc(roomDocRef.value,
                {
                    'score.bingos': scoreBingos,
                    [`bingoItems.item-${index}.complete`]: val,
                    [`score.scoreBoard.${player.value.color}`]: increment(val ? 1 : -1)
                }
            );
        } catch (err) {
            console.log(err);
        }
    }
    function getBingoLines() {
        const lines = [];

        // Rows (indices 0-4)
        for (let row = 0; row < 5; row++) {
            const rowIndices = Array.from({ length: 5 }, (_, i) => row * 5 + i);
            lines.push(rowIndices);
        }

        // Columns (indices 5-9)
        for (let col = 0; col < 5; col++) {
            const colIndices = Array.from({ length: 5 }, (_, i) => i * 5 + col);
            lines.push(colIndices);
        }

        // Diagonal 1 (index 10)
        const diagonal1 = [0, 6, 12, 18, 24];
        lines.push(diagonal1);

        // Diagonal 2 (index 11)
        const diagonal2 = [4, 8, 12, 16, 20];
        lines.push(diagonal2);

        return lines;
    }
    async function initPlayer(uuid) {
        if (!roomData.value.players[uuid]) {
            try {
                await updateDoc(roomDocRef, {
                    [`players.${uuid}`]: {
                        joinedOn: serverTimestamp()
                    }
                })
                const roomRef = doc(collection(db, `users/${uuid}/rooms`), roomId.value);
                await setDoc(roomRef, { roomName: roomData.value.name, roomId: roomId.value, joinedOn: serverTimestamp() }, { merge: true });
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log('PLAYER EXISTS');
        }
    }
    return { toggleItemCompletion, getBingoLines, initPlayer, updatePlayerColor }
}


</script>
<style lang="scss">
.bingo-room {
    display: grid;
    grid-template-columns: 1fr;
    --player-color: v-bind(player.color); //todo:afterIdentifyingPlayer match colour this needs to be a v-bind
}
</style>