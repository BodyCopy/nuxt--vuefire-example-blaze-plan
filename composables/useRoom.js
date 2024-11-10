import bcrypt from 'bcryptjs';
import { useFirestore } from 'vuefire';
import { addDoc, collection, serverTimestamp, getDoc, doc, updateDoc } from 'firebase/firestore';
import { generateRandomSeed, getRandomItemsWithSeed } from '../utilities/bingoUtilities';
import { push, ref as rtdRef, serverTimestamp as rtdServerTimestamp } from 'firebase/database';
export const useRoom = ((roomId, roomData, gameSettings, activePlayer) => {
    //Event Log
    const rtdb = useDatabase();
    const eventDbRef = rtdRef(rtdb, `rooms/${roomId}/event`);
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

    return { logEvent };
})