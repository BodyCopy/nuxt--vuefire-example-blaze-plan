import bcrypt from 'bcryptjs';
import { useFirestore } from 'vuefire';
import { addDoc, collection, serverTimestamp, getDoc, doc, updateDoc } from 'firebase/firestore';
import { generateRandomSeed, getRandomItemsWithSeed } from './bingoUtilities';
import { push, ref as rtdRef, serverTimestamp as rtdServerTimestamp } from 'firebase/database';
export const useRoom = ((roomId) => {
    const db = useFirestore();
    const roomDocRef = doc(db, `rooms/${roomId}`);
    const rtdb = useDatabase();
    const eventDbRef = rtdRef(rtdb, `rooms/${roomId}/event`);
    async function getRandomizedCardFromTemplate(template, seed) {
        if (!seed) {
            seed = generateRandomSeed();
        }
        const templateRef = doc(db, 'templates', template);
        const bingoItemsSnapshot = await getDoc(templateRef);
        const bingoItems = bingoItemsSnapshot.data().bingoItems;
        const randomizedBingoItems = getRandomItemsWithSeed(bingoItems, seed, 25);
        const newCard = {}

        //set bingoItems for room creation
        //map bingoItems array to key:value pairs
        //25 items for a 5x5 card
        for (let i = 0; i <= 24; i++) {
            let bi = randomizedBingoItems[i];
            newCard[`item-${i}`] = { name: bi, complete: '' };
        }
        return { newCard, seed };
    }
    async function logEvent(event, value) {
        try {
            await push(eventDbRef, {
                event: event,
                value: value,
                timestamp: rtdServerTimestamp()
            }
            )
            console.log(event, '-logged');
        } catch (err) {
            console.log('error', err);
        }
    }

    async function updateRoomData(field, val) {
        try {
            await updateDoc(roomDocRef, {
                [field]: val
            })
        } catch (err) {
            console.log('error', err);

        }
    }

    return { getRandomizedCardFromTemplate, logEvent, updateRoomData }
})