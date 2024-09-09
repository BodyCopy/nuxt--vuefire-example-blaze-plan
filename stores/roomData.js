import { doc, collection, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useFirestore, useDocument } from "vuefire";

const roomStores = {};

export function useRoomStore(id) {
    if (!roomStores[id]) {
        const db = useFirestore();
        const docRef = doc(collection(db, 'rooms'), id);
        const roomData = useDocument(docRef);
        // const myPlayer match id to player and match to player in room
        async function checkPassword() {
            // Your logic
        }

        async function updateBingoItem(coordinates, key, value) {
            let itemId = (coordinates[0] * 5) + (coordinates[1]);
            try {
                await updateDoc(docRef, {
                    [`bingoItems.item-${itemId}.${key}`]: value,
                });
            } catch (err) {
                console.log(err);
            }
        }

        roomStores[id] = { roomData, checkPassword, updateBingoItem };
    }

    return roomStores[id];
}