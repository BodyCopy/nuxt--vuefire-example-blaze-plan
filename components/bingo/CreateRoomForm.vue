<template>
    <form @submit.prevent="createRoom" class="form-room">
        <fieldset class="retro-form">
            <BaseInput v-model="roomName.value" label="Room name" retro :validated="roomName.validated"
                :error-text="roomName.errorText" :maxLength="20" :character-count="roomName.value.length"
                helper-text="Max 20 characters" placeholder="---"></BaseInput>
            <BaseInput v-model="password.value" label="Password" retro :validated="password.validated"
                :error-text="password.errorText" helper-text="Players will need this to enter" placeholder="---">
            </BaseInput>
            <BaseSelect v-model="game.value" label="Game" retro></BaseSelect>
            <BaseToggle v-model="game.custom" label="Custom game" retro :statusText="true"></BaseToggle>
            <BaseInput v-model="template.value" label="Template" retro :validated="template.validated"
                :error-text="template.errorText"></BaseInput>
            <BaseButton btn-modifier="micro" @click.prevent="() => { $emit('custom-template', true) }">Upload JSON
            </BaseButton>
            <BaseButton btn-modifier="micro" @click.prevent="() => { $emit('custom-template', true) }">New template
            </BaseButton>
            <BaseButtonSet v-model="gameType.value" :options="gameType.options" label="Game type" width="fc"
                :helper-text="gameType.helperText">
            </BaseButtonSet>
            <BaseButtonSet v-if="gameType.value === 'shared'" v-model="gameMode.value" :options="gameMode.options"
                label="Game mode" width="fc" :helper-text="gameMode.helperText">
            </BaseButtonSet>
            <BaseInput v-if="gameType.value !== 'multi'" v-model="seed.value" label="Seed" retro
                :validated="seed.validated" :error-text="seed.errorText" helper-text="Leave empty for a random seed"
                placeholder="---"></BaseInput>
            <BaseBoolean v-model="hideBoardInitially"
                :label="`Hide board${gameType.value === 'multi' ? 's' : ''} initially?`"></BaseBoolean>
            <BaseBoolean v-model="hasTimer.value" label="Include timer?"></BaseBoolean>
        </fieldset>
        <ArrowSeperator></ArrowSeperator>
        <fieldset class="retro-form">
            <BaseInput v-model="nickname.value" label="Nickname" retro :validated="nickname.validated"
                :error-text="nickname.errorText" placeholder="ex. Morbius" :maxLength="20"
                helper-text="Max 20 characters" :character-count="nickname.value.length"></BaseInput>
            <PlayerColorSelector v-model="playerColor.value"></PlayerColorSelector>
        </fieldset>
        <ArrowSeperator></ArrowSeperator>
        <JoinEnterRoomSection :player-color="playerColor.value" :nickname="nickname.value" :ready>
        </JoinEnterRoomSection>
    </form>
</template>
<script lang="js" setup>
import bcrypt from 'bcryptjs';
import { useFirestore } from 'vuefire';
import { addDoc, collection, serverTimestamp, getDoc, doc } from 'firebase/firestore';
// Analytics can only be retrieved on the client
const db = useFirestore();

function checkUser() {
    console.log(user.value.uid);
}
const ready = computed(() => {
    return (
        roomName.validated &&
        password.validated &&
        nickname.validated &&
        game.validated &&
        template.validated &&
        gameType.validated &&
        (gameType.value !== 'multi' ? gameMode.validated : true) && // Only validate gameMode if not 'multi'
        (gameType.value !== 'multi' ? seed.validated : true) && // Only validate seed if not 'multi'
        playerColor.validated
    );
});

const user = useCurrentUser()
const emits = defineEmits(['create-room']);

async function createRoom() {
    if (!ready.value) {
        console.log("Form not ready, validation failed.");
        return;
    }
     
    //grab a specified card template
    //todo we can sideload this after the value is updated
    const bingoItemsObject = await getRandomizedCardFromTemplate();
 

    const payload = {
        creatorColor: playerColor.value,    
        bingoItems: bingoItemsObject,
        roomName: roomName.value,
        password: password.value, // You can hash it here if needed
        creator: {
            uid: user.value.uid,
            nickname: nickname.value
        },
        players: {
            [user.value.uid]: {
                nickname: nickname.value,
                color: playerColor.value
            }
        },
        game: game.value,
        template: template.value,
        gameType: gameType.value,
        gameMode: 'lockOut', // Include only if not 'multi'
        seed: 'IM A RANDOM SEED', // Include only if not 'multi'
        hideBoardInitially: hideBoardInitially.value,
        hasTimer: hasTimer.value,
    };

    // Emit the payload
    emits('create-room', payload);
    console.log('Room created with payload:', payload);
}
const roomName = reactive({
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: ''
})
const password = reactive({
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: ''
})
const nickname = reactive({
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: ''
})
const game = reactive({
    value: 'Elden Ring',
    validated: true,
    errorText: 'Invalid',
    pattern: '',
    custom: false
})
const template = reactive({
    value: '6ef29a4f-d094-4c5d-82e4-ed5e7f954d5d',
    validated: true,
    errorText: 'Invalid',
    pattern: '',
    custom: false
})
const gameType = reactive({
    options: { Shared: 'shared', 'Multi-card': 'multi' },
    value: 'shared',
    validated: true,
    errorText: 'Invalid',
    pattern: '',
    helperTextMap: {
        shared: 'Players share the same bingo card',
        multi: 'Players are each given a random card'
    },
    get helperText() {
        return this.helperTextMap[this.value] || '';
    }
});

const gameMode = reactive({
    options: { Standard: 'standard', 'Lock-out': 'lockOut' },
    value: 'standard',
    validated: true,
    errorText: 'Invalid',
    pattern: '',
    helperTextMap: {
        standard: 'Players compete to complete 5 items in a row or diagonally',
        lockOut: 'Players will not be able to complete items another player has already completed'
    },
    get helperText() {
        return this.helperTextMap[this.value] || '';
    }
})

const seed = reactive({
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: ''
})
const playerColor = reactive({
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: ''
})

const hasTimer = reactive({
    value: false,
    helperText: 'The bingo game will display a timer'
})


const hideBoardInitially = ref(false);
</script>
<style lang="scss"></style>