import { doc, collection, setDoc, getDoc, updateDoc, serverTimestamp, FieldValue, increment, addDoc } from "firebase/firestore";
import { useFirestore, useDocument } from "vuefire";

const roomStores = {};

export function useRoomStore(id) {
    if (!roomStores[id]) {
        const db = useFirestore();
        const docRef = doc(collection(db, 'rooms'), id);
        const roomData = useDocument(docRef);
        const gameMode = computed(() => {
            return roomData.gameMode;
        })
        const playerUuid = ref(null);
        const player = computed(() => {
            return { ...roomData.value.players[playerUuid.value], uuid: playerUuid.value }
        });
        const bingos = computed(() => {
            return roomData.value.score.bingos
        });
        // const myPlayer match id to player and match to player in room
        async function checkPassword() {
            // Your logic
        }
        //todo: this may be causing the null user thing
        async function initPlayer(uuid) {
            playerUuid.value = uuid;
            if (!roomData.value.players[uuid]) {
                try {
                    await updateDoc(docRef, {
                        [`players.${uuid}`]: {
                            joinedOn: serverTimestamp()
                        }
                    })
                    const roomRef = doc(collection(db, `users/${uuid}/rooms`), id);
                    await setDoc(roomRef, { roomTitle: roomData.value.title, roomId: id, joinedOn: serverTimestamp() }, { merge: true });
                } catch (err) {
                    console.log(err);
                }
            } else {
                console.log('PLAYER EXISTS', playerUuid.value);
            }
        }
        async function updatePlayerColor(color) {
            try {
                await updateDoc(docRef, {
                    [`players.${player.value.uuid}.color`]: color
                })
            } catch (err) {
                console.log(err);
            }
        }
        async function updateBingoItem(coordinates, key, value) {
            let val = value;
            if (value === '') {
                val = player.value.color;
            } else if (value === player.value.color) {
                val = '';
            } else {
                return;
            }
            let itemId = (coordinates[0] * 5) + (coordinates[1]);
            try {
                await updateDoc(docRef, {
                    [`bingoItems.item-${itemId}.${key}`]: val,
                });
                await updateDoc(docRef, {
                    [`score.scoreBoard.${player.value.color}`]: increment(val ? 1 : -1)
                }
                )
            } catch (err) {
                console.log(err);
            }
        }

        //chatGPT functions

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
        // await toggleItemCompletion([rIndex, cIndex], roomData.bingoItems, roomData.score.bingos);
        const bingoLines = (() => { return getBingoLines() })();
        // Function to toggle item completion and check bingo state
        async function toggleItemCompletion(coordinates, items, bingos) {
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

                await updateDoc(docRef,
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

        roomStores[id] = { roomData, player, bingos, checkPassword, updateBingoItem, initPlayer, updatePlayerColor, toggleItemCompletion };
    }

    return roomStores[id];
}