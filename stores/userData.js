import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
    query,
    collection,
    where,
    getDocs
} from 'firebase/firestore'
export function useUserData(userId) {
    const db = useFirestore();

    const templateCollectionRef = collection(db, 'templates');
    const templateQuery = query(templateCollectionRef, where('creator.uid', '==', userId));
    const userTemplates = useCollection(templateQuery); // Fetch and bind data
    const userRoomsRef = collection(db, `users/${userId}/rooms`);
    const userRooms = useCollection(userRoomsRef); // Fetch and bind data

    return { userTemplates, userRooms };
};
