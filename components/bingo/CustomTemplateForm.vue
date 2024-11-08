<template>
    <BaseButton btn-modifier="condensed" @click="() => { $emit('custom-template', false) }">Back</BaseButton>
    <form class="custom-template-form room-form" @submit.prevent action="">
        <fieldset class="retro-form calculator-screen">
            <BaseDropZone @uploaded-images="handleUploads" :dropzone="false">Upload JSON</BaseDropZone>
            <!-- <legend>Add items</legend> -->
            <BaseTextArea v-model="bingoItem" label="Enter items" @keydown.enter.prevent="addItem" name="bingo-item"
                helper-text='112 max characters' :character-count="bingoItem.length" max-length="112"
                placeholder='Type a bingo card and press "enter"' :rows="2" retro width="fc"></BaseTextArea>
        </fieldset>
        <fieldset class="retro-forn calculator-screen">
            <div class="item-counter">
                <div class="items-counter ltr-layout">
                    <SegmentDisplay :string="uploadAmount"></SegmentDisplay>
                    <label>Items</label>
                </div>
                <BaseButton @click="swapSortDirection" btn-modifier="micro">{{ sortDirection.toUpperCase() }}
                </BaseButton>
                <BaseButton @click="() => { bingoItems = [] }" btn-modifier="micro">{{ 'CLEAR' }}
                </BaseButton>

            </div>
            <TransitionGroup name="list" tag="ol" class="bingo-items-list">
                <BingoLineItem v-for="(item, i) in bingoItems" :key="i" :index="i" @delete="deleteItem(i)">
                    {{ item }}
                </BingoLineItem>
            </TransitionGroup>
        </fieldset>
        <div class="fixed-action-bar ltr-layout">
            <div class="items-counter ltr-layout">
                <SegmentDisplay :string="uploadAmount"></SegmentDisplay>
                <label>Items</label>
            </div>
            <BaseButton @click.prevent="createBingoCard" btn-style="outline">Save</BaseButton>
            <!-- <BaseButton @click.prevent="testBingoCard" btn-style="outline">Test</BaseButton> -->
        </div>
    </form>
</template>
<script setup>
import { collection, doc, getDoc, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from 'vuefire';
import { useRooms } from '~/composables/roomUtilities';
import { generateRandomSeed, getRandomItemsWithSeed } from '~/composables/bingoUtilities';
import { v4 as uuidv4 } from 'uuid';
import { useStorage } from '@vueuse/core';
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

const templateTitle = ref('');
const password = ref('');
const cardSize = ref(5);
const randomSeed = ref(generateRandomSeed());
const template = ref(route.query.templateId || false);
const game = ref(route.query.game || '');
const bingoItem = ref('');
const bingoItems = useStorage('template-bingo-items', []);
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
    //todo add logic for staticBingo
    if (bingoItems.value.length >= 50) {
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

        // await createRoom({
        //     ...data,
        //     password: password.value,
        //     templateId: template.value,
        //     title: templateTitle.value.toLowerCase() || 'untitled',
        //     seed: randomSeed.value,
        //     bingoItems: mappedItems,
        //     lastUserOn: serverTimestamp(),
        //     score: { bingos: Array(12).fill[{}] },
        //     players: [],
        //     gameMode: gameMode.value
        // });
        // const roomCollectionRef = collection(db, 'rooms');
        // await addDoc(roomCollectionRef, {
        //     ...data,
        //     templateId: template.value,
        //     title: templateTitle.value || 'Untitled',
        //     seed: randomSeed.value,
        //     bingoItems: mappedItems,
        //     lastUserOn: serverTimestamp(),
        //     score: { bingos: Array(12).fill[''] },
        //     players: [],
        //     gameMode: gameMode.value
        // });
        console.log('added');
        bingoItems.remove();
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
.custom-template-form {
    --segment-display-height: 1.125rem;

    &>.calculator-screen::after {
        background-color: black;
    }
}

.bingo-items-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(32ch, 1fr));
}

.item-counter {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr max-content;

    &>.items-counter {
        &>.segment-display {}
    }
}

.fixed-action-bar {
    position: fixed;
    bottom: 0;
    padding: 0.5rem;
    left: 0;
    right: 0;
    background-color: var(--background-color);
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