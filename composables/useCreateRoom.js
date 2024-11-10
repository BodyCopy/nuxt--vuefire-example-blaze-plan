import bcrypt from 'bcryptjs';
import { useFirestore } from 'vuefire';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, serverTimestamp, getDoc, doc, getDocs, updateDoc, query, where, setDoc, runTransaction } from 'firebase/firestore';
import { generateRandomSeed, getRandomItemsWithSeed } from '../utilities/bingoUtilities';
import { push, ref as rtdRef, serverTimestamp as rtdServerTimestamp } from 'firebase/database';



export function useCreateRoom() {
    const db = useFirestore();
    async function createBingoCardTemplate(bingoItems, creator, game) {
        const bingoCardTemplateRef = doc(db, 'templates');
        const payload = {
            bingoItems,
            creator,//{displayName,uid}
            game: game || 'custom',
            lastUsedOn: serverTimestamp(),
            createdOn: serverTimestamp(),
        }
        try {
            await addDoc(bingoCardTemplateRef, payload);
        } catch (err) {

        }
    }
    async function updateBingoCardTemplate(bingoItems, templateId) {
        const bingoCardTemplateRef = doc(db, `templates/${templateId}`);
        try {
            await setDoc(bingoCardTemplateRef, { bingoItems, updatedOn: serverTimestamp() }, { merge: true });
        } catch (err) {

        }
    }
    async function getBingoCardItemsFromTemplate(templateId) {
        const bingoCardTemplateRef = doc(db, `templates/${templateId}`);
        const bingoCardTemplateData = await getDoc(bingoCardTemplateRef);
        const templateData = bingoCardTemplateData.data();
        return templateData;
    }
    function randomizeBingoCardFromTemplate(bingoItems, seed) {
        if (!seed) {
            seed = generateRandomSeed();
        }
        const randomizedBingoItems = getRandomItemsWithSeed(bingoItems, seed, 25);
        const newCard = {};

        for (let i = 0; i <= 24; i++) {
            let bi = randomizedBingoItems[i];
            newCard[`item-${i}`] = { name: bi, complete: '' };
        }
        return { newCard, seed };
    }


    async function newBingoCards(roomId, templateId) {
        const roomRef = collection(db, `rooms/${roomId}/cards`);
        const bingoItems = await getBingoCardItemsFromTemplate(templateId);
        const roomsSnapshot = await getDocs(roomRef);
        const cardRefs = roomsSnapshot.docs.map((doc) => {
            return doc.ref;
        })
        cardRefs.forEach((ref) => {
            newBingoCard(ref, bingoItems.bingoItems);
        })

    }

    async function newBingoCard(cardRef, bingoItems, reset) {
        if (!reset) {
            const { newCard, seed } = randomizeBingoCardFromTemplate(bingoItems);
            setDoc(cardRef, {
                bingoItems: newCard,
                seed
            }, { merge: true });
        } else {
            updateDoc(cardRef, {
                bingoItems,
            });
        }
    }

    async function resetBingoCards(roomId) {
        const roomRef = collection(db, `rooms/${roomId}/cards`);
        const roomsSnapshot = await getDocs(roomRef);
        const cardRefs = roomsSnapshot.docs.map((doc) => {
            return { bingoItems: doc.data().bingoItems, ref: doc.ref };
        })
        cardRefs.forEach((doc) => {
            const resetBingoItems = Object.fromEntries(Object.entries(doc.bingoItems)
                .map(([key, val]) => [key, { ...val, complete: "" }]));
            newBingoCard(doc.ref, resetBingoItems, true);
        })
    }

    async function createRoom(payload) {
        //hash and set password
        const hashedPassword = await bcrypt.hash(payload.password, 10);

        const { seed, bingoItems, creatorColor, ...roomData } = payload;

        const roomCode = await generateUniqueRoomCode();
        const newRoomRef = doc(db, `rooms/${roomCode}`);

        const roomRef = await setDoc(newRoomRef,
            {
                ...roomData,
                roomCode: roomCode,
                createdOn: serverTimestamp(),
                lastUsedOn: serverTimestamp(),
            }
        )
        const gameSettings = {
            gameType: payload.gameType,
            gameMode: payload.gameMode,
            teamSizes: payload.teamSizes
        }

        await createNewBingoCard(roomCode, gameSettings, { ...payload.creator, color: creatorColor }, payload.bingoItems, seed);

        const scoreBoardRef = doc(newRoomRef, 'scores/scoreBoard');

        await runTransaction(db, async (transaction) => {
            const scoreBoardDoc = await transaction.get(scoreBoardRef);

            if (!scoreBoardDoc.exists() || !scoreBoardDoc.data().teams[creatorColor]) {
                // Field doesn't exist, so initialize it
                transaction.set(scoreBoardRef, {
                    bingos: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                    teams: {
                        [creatorColor]: { players: [payload.creator.uid], score: 0 }
                    }
                }, { merge: true }); // Use merge to avoid overwriting other fields
            }
        });

    }

    async function createNewBingoCard(roomId, gameSettings, player, bingoItems, seed, options) {
        let cardsRef;
        let replaceCard = options?.override || false;
        if (gameSettings.gameType === 'multi') {
            cardsRef = doc(db, `rooms/${roomId}/cards/${player.color}-card`);
        } else {
            cardsRef = doc(db, `rooms/${roomId}/cards/card`);
        }
        //this you will need to reuse if you want to generate cards on the fly
        await setDoc(cardsRef,
            {
                bingoItems,
                players: {
                    [player.uid]: {
                        nickname: player.nickname,
                    }
                },
                createdOn: serverTimestamp(),
                lastUsedOn: serverTimestamp(),
                seed
            }, { merge: !replaceCard }
        );
    }

    async function generateUniqueRoomCode() {
        let roomCode;
        let isUnique = false;
        let roomCollectionRef = collection(db, 'rooms');
        while (!isUnique) {
            roomCode = uuidv4().slice(0, 4); // Extract first 6 characters from UUID
            const docRef = doc(roomCollectionRef, roomCode);
            const docSnapshot = await getDoc(docRef);
            isUnique = !docSnapshot.exists(); // Ensure uniqueness
        }

        return roomCode;
    }

    return {
        getBingoCardItemsFromTemplate,
        createBingoCardTemplate,
        updateBingoCardTemplate,
        randomizeBingoCardFromTemplate,
        createRoom,
        newBingoCards,
        newBingoCard,
        resetBingoCards
    }
}