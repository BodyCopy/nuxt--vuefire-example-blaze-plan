import { defineStore } from 'pinia'
import { doc, updateDoc } from 'firebase/firestore';
import { useUserStore } from '~/stores/userStore.js';
// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
const route = useRoute();
export const useRoomStore = defineStore('room', () => {
    const db = useFirestore();
    const { user } = useUserStore();
    //State
    const roomDocRef = computed(() => doc(db, `rooms/${route.params.id}`));
    const roomData = useDocument(roomDocRef);

    const gameSettings = computed(() => {
        if (!roomData.value) return {};
        return {
            gameType: roomData.value?.gameType,
            gameMode: roomData.value?.gameMode,
            teamSizes: roomData.value?.teamSizes
        }
    })
    const activePlayer = computed(() => {
        if (user.value && roomData.value) {
            console.log('PLAYER', user.value);
            return { ...roomData.value.players[user.value], uuid: user.value }
        } else {
            return {};
        }
    });
    //GETTERS

    // DOCUMENT LISTENER MANAGEMENT

    async function initializeRoomForPlayer() {
        //match userId with player in room if no player exists {handle tbd}
        //find player card
        //load card data
    }

    //ACTIONS
    async function updateRoomData(field, val) {
        try {
            await updateDoc(roomDocRef.value, {
                [field]: val
            })
        } catch (err) {
            console.log('error', err);

        }
    }

    return { roomData, roomDocRef, gameSettings, updateRoomData, activePlayer };
})