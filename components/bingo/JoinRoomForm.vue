<template>
    <form @submit.prevent="joinRoom">
        <fieldset class="retro-form calculator-screen">
            <BaseInput v-model="password.value" placeholder="-secret-" label="Password" retro
                :validated="password.validated" :error-text="password.errorText"></BaseInput>
            <!-- todo add the burnpad typeAhead chipInput -->
            <BaseButtonSet label="Joining as" v-model="playerRole.value" width="fc" :options="playerRole.options"
                :retro="true">
            </BaseButtonSet>
        </fieldset>
        <ArrowSeperator />
        <fieldset class="retro-form calculator-screen">
            <BaseInput v-model="nickname.value" label="Nickname" retro :validated="nickname.validated"
                :error-text="nickname.errorText" placeholder="---" :maxLength="20" helper-text="Max 20 characters"
                :character-count="nickname.value.length"></BaseInput>
            <PlayerColorSelector v-model="playerColor.value"></PlayerColorSelector>
        </fieldset>
        <ArrowSeperator />
        <!-- <div class="testing">
            <h5>For testing:</h5>
            <p>{{ user?.uid || 'tbd' }}</p>
            <strong>{{ user?.isAnonymous ? 'Anon' : '' || 'tbd' }}</strong>
            <button v-if="isUserLoaded && !user?.uid" btn-style="outline" @click.prevent="anonSignIn">Anon
                login</button>
        </div> -->
        <JoinEnterRoomSection v-if="userExists" :player-color="playerColor.value" :nickname="nickname.value" :ready
            :submitCopy>
        </JoinEnterRoomSection>
    </form>
</template>
<script setup>
import { signInAnonymously } from 'firebase/auth';
import { useFirebaseAuth, getCurrentUser, useIsCurrentUserLoaded } from 'vuefire';
import { useLocalStorage } from '#imports';
const emits = defineEmits(['join-room']);
const props = defineProps({ roomData: Object });
//anon auth for testing purposes
const userExists = getCurrentUser();
const isUserLoaded = useIsCurrentUserLoaded()
const submitCopy = computed(() => {
    return existingPlayer.value ? 'Re-join' : '>> Ready >>';
})
const existingPlayer = ref(false);
const user = useLocalStorage('user.uid') || useCurrentUser();
const auth = useFirebaseAuth(); // only exists on client side
async function anonSignIn() {
    await signInAnonymously(auth);
    useLocalStorage('user.uid', user.uid)
    console.log('anon login');
}
watch(props.roomData, ((nV, oV) => {
    if (nV.players[user.uid]) {
        existingPlayer.value = true;
        let existingPlayerData = props.roomData.players[user.uid];
        nickname.value = existingPlayerData.nickname;
        playerColor.value = existingPlayerData.color;
        playerRole.value = 'player';
        console.log('existing player');

    } else {
        console.log('new player');
    }
}))
watch(user, (nV, oV) => {
    if (props.roomData.players[nV.uid]) {
        existingPlayer.value = true;
        let existingPlayerData = props.roomData.players[nV.uid];
        nickname.value = existingPlayerData.nickname;
        playerColor.value = existingPlayerData.color;
        playerRole.value = 'player';
        console.log('existing player');

    } else {
        console.log('new player');

        return;
    }
})
const buttonDisabled = computed(() => {
    if (password.validated && nickname.validated && playerColor.validated) {
        return false;
    }
    else { return true };
})

const password = reactive({
    value: '',
    validated: true,
    errorText: 'Password was incorrect',
    pattern: ''
})
const nickname = reactive({
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: ''
})
const playerColor = reactive({
    value: '',
    errorText: 'Invalid',
    pattern: '',
    get validated() {
        return !!this.value;
    }
})
const playerRole = reactive({
    value: 'player',
    errorText: 'Select your role',
    options: { Player: 'player', Spectator: 'spectator' },
    get validated() {
        return !!this.value;
    }
})
const ready = computed(() => {
    return nickname.validated && password.validated && playerColor.validated && playerRole.validated;
})
function joinRoom() {
    //validate here before emit
    //todo
    const payload = {
        password: password.value,
        nickname: nickname.value,
        playerRole: playerRole.value,
        playerColor: playerColor.value,
        existingPlayer: existingPlayer.value,
    }

    emits('join-room', payload);
}
</script>