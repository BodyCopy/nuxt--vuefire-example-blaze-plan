import bcrypt from 'bcryptjs';
import { useFirestore } from 'vuefire';
import { addDoc, collection, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { generateRandomSeed, getRandomItemsWithSeed } from './bingoUtilities';

export const useRoom = ((roomId) => {
    const db = useFirestore();
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
    return { getRandomizedCardFromTemplate }
})