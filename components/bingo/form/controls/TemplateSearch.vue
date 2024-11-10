<template>
    <div class="template-search retro">
        <span class="control-label">Select template</span>
        <div class="ltr-layout">
            <BaseBoolean v-model="searchCommunityTemplates" label="Community"></BaseBoolean>
            <BaseBoolean v-model="searchMyTemplates" label="Personal"></BaseBoolean>
        </div>
        <BaseSearch v-model.trim="model" @blur="closeMenu" ref="searchField" width="fc" :retro display="ttb">
        </BaseSearch>
        <BaseMenu v-if="searchResults" tab-index="1" class="type-ahead" :menuItems="searchResults"
            @menu-item-event="() => { model = ''; chipInputField.focusInput(); }">
        </BaseMenu>
    </div>
</template>
<script setup>
import { useFirestore } from 'vuefire';
import { query, getDocs, collection, doc, getDoc, limit, where } from 'firebase/firestore';
const db = useFirestore();
const props = defineProps({
    game: { type: String, default: '' },
    userTemplate: { type: Boolean, default: false }
})
const searchCommunityTemplates = ref(true);
const searchMyTemplates = ref(true);
const searchField = ref(null);
const model = defineModel({ type: String, default: '' });
const typing = ref(false);

const templateCollectionRef = collection(db, 'templates');
const searchResults = ref([]);
watchEffect(async () => {
    typing.value = true;
    let game = props.game.toLowerCase();
    console.log(model.value);
    let q;
    if (props.userTemplate) {
        q = query(templateCollectionRef, where('creator', '==', `${props.userTemplate}`), where('game', '=='), where('title', '>=', `${model.value}`), limit(8));
    } else {
        q = query(templateCollectionRef, where('game', '==', `${game}`), where('title', '>=', `${model.value}`), limit(8));
    }
    const templates = await getDocs(q);
    console.log(templates);

    searchResults.value = templates.docs.map((d) => {
        let data = d.data();
        console.log(data);
        return {
            label: data.title
        }
    });
})


const closeMenu = async () => {
    setTimeout(() => {
        const isFocusedOnMenuItem = document.activeElement && document.activeElement.closest('.type-ahead');
        if (!isFocusedOnMenuItem) {
            typing.value = false;
        }
    }, 0);
}
</script>
<style lang="scss">
.template-search {
    height: max-content;
    background-color: var(--calculator-screen-background);
    padding: 0.5rem;
}

.control-label {
    letter-spacing: 0.075em;
    text-transform: uppercase;
    color: var(--S-05);
    text-shadow: 0 1px 2px black;
}
</style>