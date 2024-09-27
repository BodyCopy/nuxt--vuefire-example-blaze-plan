import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from 'vuefire';

// Define the type for the room data
interface RoomData {
    createdOn?: any;
    size: number;
    game: string;
    creator: { uid: any, displayName: any };

    password: string;
    templateId: string;
    title: string;
    seed: number;
    bingoItems: Record<string, any>; // Adjust type according to your item structure
    lastUsedOn?: any; // Using 'any' for serverTimestamp, but can refine this with Firestore types if needed
    score: {
        bingos: string[];
    };
    players: { [key: string]: any }; // Assuming players are stored in an object map, refine if needed
    gameMode: string;
}


export const useRooms = () => {
    const db = useFirestore();
    async function createRoom(data: RoomData): Promise<void> {
        const roomCollectionRef = collection(db, 'rooms');
        await addDoc(roomCollectionRef, {
            ...data,
            createdOn: serverTimestamp(),
            lastUsedOn: serverTimestamp(), // Adding the Firestore timestamp
        });
    }
    return { createRoom }
}
