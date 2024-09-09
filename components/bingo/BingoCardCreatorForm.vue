<template>
    <form class="bingo-card-creator-form" @submit.prevent action="">
        <fieldset>
            <legend>Room data</legend>
            <BaseInput v-model="roomName" label="Room name" width="fc"></BaseInput>
            <BaseSelect v-model="template" default-value="--or use a template--" label="Template" width="fc"
                :options="['yellow', 'red']">
            </BaseSelect>
            <BaseInput v-model="cardSize" label="Card size" width="fc" type="number"></BaseInput>
            <BaseTextArea v-model="randomSeed" label="Seed" width="fc"></BaseTextArea>
            <BaseSelect default-value="Standard" label="Game mode" width="fc" :options="['yellow', 'red']"></BaseSelect>
        </fieldset>
        <fieldset>
            <legend>Bingo card</legend>
            <BaseDropZone @uploaded-images="handleUploads"></BaseDropZone>
            <BaseTextArea v-model="bingoItem" label="Enter item" @keydown.enter.prevent="addItem" name="bingo-item"
                helper-text='112 max characters' :character-count="bingoItem.length" max-length="112"
                placeholder='Type a bingo card and press "enter"'></BaseTextArea>
            <BaseButton @click="randomize">Randomize</BaseButton>
            <p>Total:{{ bingoItems.length }}</p>
            <TransitionGroup name="list" tag="ol" class="bingo-items-list">
                <BingoLineItem v-for="(item, i) in bingoItems" :key="item" @delete="deleteItem(i)">
                    {{ item }}
                </BingoLineItem>
            </TransitionGroup>
        </fieldset>
        <button @click.prevent="createBingoCard">Save</button><button @click.prevent="testBingoCard">Test</button>
    </form>
</template>
<script setup>
import { collection, doc, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from 'vuefire';
import useBingoUtilities from '~/composables/bingoUtilities';
import { v4 as uuidv4 } from 'uuid';
const { generateRandomSeed, getRandomItemsWithSeed } = useBingoUtilities();

const db = useFirestore();
const user = useCurrentUser();

const emits = defineEmits(['create-bingo-card', 'test-bingo-card']);
const props = defineProps({})
const uploadedFiles = ref(null);
function randomize() {
    bingoItems.value = getRandomItemsWithSeed(bingoItems.value, randomSeed.value, bingoItems.value.length);
    console.log(bingoItems.value);
}
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
const cardSize = ref(5);
const randomSeed = ref(generateRandomSeed());
const template = ref(null);
const bingoItem = ref('');
const bingoItems = ref([]);
function addItem() {
    if (bingoItems.value.length >= 25) {
        alert('full')
        return;
    }
    if (bingoItem.value !== '' || null) {
        bingoItems.value.unshift(bingoItem.value.trimEnd());
        bingoItem.value = '';
    }
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
            creator: user.displayName || 'Anonymous',
            size: cardSize.value,
            score:{},
            players:[]
        }
        if (!template.value) {
            template.value = uuidv4();
            const cardTemplateCollectionRef = doc(db, `templates/${template.value}`);
            await setDoc(cardTemplateCollectionRef, {
                ...data,
                bingoItems: bingoItems.value,
                updatedOn: serverTimestamp(),
                lastUserOn: serverTimestamp(),
            }, { merge: true })
        }
        const randomItems = getRandomItemsWithSeed(bingoItems.value, randomSeed.value, (cardSize.value ** 2));

        const mappedItems = randomItems.reduce((acc, item, index) => {
            acc[`item-${index}`] = { name: item, complete: false };
            return acc;
        }, {});

        const roomCollectionRef = collection(db, 'rooms');
        await addDoc(roomCollectionRef, {
            ...data,
            templateId: template.value,
            title: roomName.value || 'Untitled',
            seed: randomSeed.value,
            bingoItems: mappedItems,
            lastUserOn: serverTimestamp(),
        });
        console.log('added');
    }

}

</script>
<style lang="scss">
.bingo-card-creator-form {
    display: grid;
    grid-template-columns: minmax(24ch, 1fr) 3fr;
}

.bingo-items-list {
    padding: 0.5rem;
    background-color: var(--B-45);
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fit, minmax(32ch, 1fr));
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