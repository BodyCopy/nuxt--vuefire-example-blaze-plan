<template>
    <BaseButton btn-modifier="condensed" @click="() => { $emit('custom-template', false) }">Back</BaseButton>
    <form class="custom-template-form" @submit.prevent action="">
        <fieldset>
            <legend>Bingo card</legend>
            <BaseDropZone @uploaded-images="handleUploads"></BaseDropZone>
            <BaseTextArea v-model="bingoItem" label="Enter item" @keydown.enter.prevent="addItem" name="bingo-item"
                helper-text='112 max characters' :character-count="bingoItem.length" max-length="112"
                placeholder='Type a bingo card and press "enter"'></BaseTextArea>
            <BaseButton @click="randomize">Randomize</BaseButton>
            <div class="item-counter">
                <SegmentDisplay :string="uploadAmount"></SegmentDisplay>
                <p>items</p>
                <BaseButton @click="swapSortDirection" btn-modifier="micro">{{ sortDirection.toUpperCase() }}
                </BaseButton>
            </div>
            <TransitionGroup name="list" tag="ol" class="bingo-items-list">
                <BingoLineItem v-for="(item, i) in bingoItems" :key="i" :index="i" @delete="deleteItem(i)">
                    {{ item }}
                </BingoLineItem>
            </TransitionGroup>
        </fieldset>
        <div class="fixed-action-bar">
            <button @click.prevent="createBingoCard">Save</button><button @click.prevent="testBingoCard">Test</button>
        </div>
    </form>
</template>
<script setup>
import { collection, doc, getDoc, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from 'vuefire';
import { useRooms } from '~/composables/roomUtilities';
import useBingoUtilities from '~/composables/bingoUtilities';
import { v4 as uuidv4 } from 'uuid';
const { generateRandomSeed, getRandomItemsWithSeed } = useBingoUtilities();
const { createRoom } = useRooms();
const db = useFirestore();
const user = useCurrentUser();
const route = useRoute();
const emits = defineEmits(['create-bingo-card', 'test-bingo-card', 'custom-template']);
const props = defineProps({})
const uploadedFiles = ref(null);
function randomize() {
    bingoItems.value = getRandomItemsWithSeed(bingoItems.value, randomSeed.value, bingoItems.value.length);
    console.log(bingoItems.value);
}
const uploadAmount = computed(() => {
    let score = bingoItems.value.length;
    const scoreString = score.toString().padStart(3, '0');
    return scoreString; // Return the formatted score
})
async function handleUploads(files) {
    const file = files[0]

    if (file && file.type === 'application/json') {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                console.log("JSON data:", jsonData);
                jsonData.forEach(element => {
                    console.log(element);
                    bingoItems.value.push(element.name)
                });
                // Handle the JSON data (e.g., store it, process it)
            } catch (err) {
                console.error("Error parsing JSON:", err);
            }
        };

        reader.onerror = (e) => {
            console.error("Error reading file:", e);
        };

        reader.readAsText(file); // Read the file as text
    } else {
        console.error("Please upload a valid JSON file.");
    }
}

const roomName = ref('');
const password = ref('');
const cardSize = ref(5);
const randomSeed = ref(generateRandomSeed());
const template = ref(route.query.templateId || false);
const game = ref(route.query.game || '');
const bingoItem = ref('');
const bingoItems = ref([]);
const sortDirection = ref('newest');
function swapSortDirection() {
    sortDirection.value = sortDirection.value === 'oldest' ? 'newest' : 'oldest';
}
watch(sortDirection, (nV, oV) => {
    bingoItems.value = bingoItems.value.toReversed();
})
provide('bingoItems', bingoItems);
const gameMode = ref('standard');
function addItem() {
    if (bingoItems.value.length >= 25) {
        alert('full')
        return;
    }
    if (bingoItem.value !== '' && sortDirection.value === 'newest') {
        bingoItems.value.unshift(bingoItem.value.trimEnd());
    } else if (bingoItem.value !== '') {
        bingoItems.value.push(bingoItem.value.trimEnd());
    }
    bingoItem.value = '';
}
function deleteItem(i) {
    bingoItems.value = bingoItems.value.filter((bi, ind) => ind !== i);
}
function testBingoCard() {
    emits('test-bingo-card', bingoItems.value);
}
async function createBingoCard() {
    if (bingoItems.value.length > 0) {
        const data =
        {
            createdOn: serverTimestamp(),
            creator: { uid: user.value.uid || '', displayName: user.value.displayName || 'Anonymous' },
            size: cardSize.value,
            game: game.value || false,
        }
        if (!template.value) {
            template.value = uuidv4();
            const cardTemplateCollectionRef = doc(db, `templates/${template.value}`);
            await setDoc(cardTemplateCollectionRef, {
                ...data,
                bingoItems: bingoItems.value,
                updatedOn: serverTimestamp(),
                lastUserOn: serverTimestamp()
            }, { merge: true })
        }
        const randomItems = getRandomItemsWithSeed(bingoItems.value, randomSeed.value, (cardSize.value ** 2));

        const mappedItems = randomItems.reduce((acc, item, index) => {
            acc[`item-${index}`] = { name: item, complete: '' };
            return acc;
        }, {});

        await createRoom({
            ...data,
            password: password.value,
            templateId: template.value,
            title: roomName.value || 'Untitled',
            seed: randomSeed.value,
            bingoItems: mappedItems,
            lastUserOn: serverTimestamp(),
            score: { bingos: Array(12).fill[''] },
            players: [],
            gameMode: gameMode.value
        });
        // const roomCollectionRef = collection(db, 'rooms');
        // await addDoc(roomCollectionRef, {
        //     ...data,
        //     templateId: template.value,
        //     title: roomName.value || 'Untitled',
        //     seed: randomSeed.value,
        //     bingoItems: mappedItems,
        //     lastUserOn: serverTimestamp(),
        //     score: { bingos: Array(12).fill[''] },
        //     players: [],
        //     gameMode: gameMode.value
        // });
        console.log('added');
    }

}
onBeforeMount(async () => {
    //todo it might make sense to have a store so we don't need to make
    //another call if the templateId already exists on the client
    if (route.query.templateId) {
        console.log(route.query.templateId);
        const templateRef = doc(db, `templates/${route.query.templateId}`);
        const templateBingoItems = await getDoc(templateRef);
        bingoItems.value = templateBingoItems.data().bingoItems;
    }
})
</script>
<style lang="scss">
.bingo-card-creator-form {
    display: grid;
    grid-template-columns: minmax(24ch, 1fr) 3fr;
}

.bingo-items-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(32ch, 1fr));
}

.item-counter {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: max-content 1fr max-content;
}
.fixed-action-bar{
    position: fixed;
    bottom: 0;
    margin: 0.5rem;
    left: 0;
    right: 0;
}
/* Transition styles */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.list-leave-to {
    opacity: 0;
    transform: translateX(20px);
}
</style>