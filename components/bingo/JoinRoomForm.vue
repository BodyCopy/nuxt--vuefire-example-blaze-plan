<template>
    <form @submit.prevent="joinRoom">
        <fieldset class="retro-form">
            <BaseInput v-model="nickname.value" label="Nickname" retro :validated="nickname.validated"
                :error-text="nickname.errorText" placeholder="Your gamer name"></BaseInput>
            <BaseInput v-model="password.value" placeholder="-secret-" label="Password" retro
                :validated="password.validated" :error-text="password.errorText"></BaseInput>
            <!-- todo add the burnpad typeAhead chipInput -->
            <BaseButtonSet label="Joining as" v-model="playerRole.value" width="fc" :options="playerRole.options">
            </BaseButtonSet>
            <PlayerColorSelector v-model="playerColor.value" label="Choose your weapon"></PlayerColorSelector>
        </fieldset>
        <ArrowSeperator />
        <div class="testing">
            <h5>For testing:</h5>
            <p>{{ user?.uid || 'tbd' }}</p>
            <strong>{{ user?.isAnonymous ? 'Anon' : '' || 'tbd' }}</strong>
            <button v-if="isUserLoaded && !user?.uid" btn-style="outline" @click.prevent="anonSignIn">Anon login</button>
        </div>
        <JoinEnterRoomSection v-if="userExists" :player-color="playerColor.value" :nickname="nickname.value" :ready>
        </JoinEnterRoomSection>
    </form>
</template>
<script setup>
import { signInAnonymously } from 'firebase/auth';
import { useFirebaseAuth, getCurrentUser, useIsCurrentUserLoaded } from 'vuefire'
const emits = defineEmits(['join-room']);
const props = defineProps({ roomData: Object });
//anon auth for testing purposes
const userExists = getCurrentUser();
const isUserLoaded = useIsCurrentUserLoaded()
const user = useCurrentUser();
const auth = useFirebaseAuth(); // only exists on client side
function anonSignIn() {
    signInAnonymously(auth);
    console.log('anon login');
}

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
    value: null,
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
        playerColor: playerColor.value
    }

    emits('join-room', payload);
}
</script>