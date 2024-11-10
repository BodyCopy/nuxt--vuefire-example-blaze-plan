<template>
    <form @submit.prevent="joinRoom" class="join-room-form">
        <!-- <fieldset class="retro-form calculator-screen">
            <BaseInput v-model="password.value" placeholder="-secret-" label="Password" retro
                :validated="password.validated" :error-text="password.errorText"></BaseInput>
        </fieldset>
        <ArrowSeperator /> -->
        <fieldset class="retro-form calculator-screen">
            <BaseButtonSet label="Joining as" v-model="playerRole.value" width="fc" :options="playerRole.options"
                :retro="true">
            </BaseButtonSet>
            <BaseInput v-model="nickname.value" label="Your nickname" retro :validated="nickname.validated"
                :error-text="nickname.errorText" placeholder="---" :maxLength="20" helper-text="Max 20 characters"
                :character-count="nickname.value.length"></BaseInput>
            <PlayerColorSelector v-model="playerColor.value" :player-amounts="playerAmounts"></PlayerColorSelector>
        </fieldset>
        <ArrowSeperator />
        <!-- <div class="testing">
            <h5>For testing:</h5>
            <p>{{ user?.uid || 'tbd' }}</p>
            <strong>{{ user?.isAnonymous ? 'Anon' : '' || 'tbd' }}</strong>
            <button v-if="isUserLoaded && !user?.uid" btn-style="outline" @click.prevent="anonSignIn">Anon
                login</button>
        </div> -->
        <JoinEnterRoomSection v-if="ready" :player-color="playerColor.value" :nickname="nickname.value" :ready
            :submitCopy>
        </JoinEnterRoomSection>
    </form>
</template>
<script setup>
import { signInAnonymously } from 'firebase/auth';
import { useFirebaseAuth, getCurrentUser, useIsCurrentUserLoaded } from 'vuefire';
import { useLocalStorage } from '#imports';
import { useScoreStore } from '~/stores/room/scoreStore';
import { useRoomStore } from '~/stores/room/roomStore';
import { useUserStore } from '~/stores/userStore';
const emits = defineEmits(['join-room']);
const props = defineProps({ roomData: Object });
const roomStore = useRoomStore();
const scoreStore = useScoreStore();
const userStore = useUserStore();
//anon auth for testing purposes
const submitCopy = computed(() => {
    return existingPlayer.value ? 'Re-join room' : '>> Enter room >>';
})
const existingPlayer = ref(false);

const playerAmounts = computed(() => {
    if (scoreStore?.scoreData) {
        const teams = scoreStore.scoreData.teams;
        console.log('TEAMS', teams);

        const output = {};
        for (const color in teams) {
            console.log(color);
            output[color] = teams[color].players.length;
        };
        return output;
    } else {
        return {};
    }
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
    return nickname.value && playerColor.value;
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
watchEffect(() => {
    if (userStore?.user && roomStore?.roomData) {
        console.log('Checking for matches', roomStore.roomData.players);

        if (roomStore.roomData.players.hasOwnProperty(userStore.user.value)) {
            let existingPlayerData = roomStore.roomData.players[userStore.user.value];
            nickname.value = existingPlayerData.nickname;
            playerColor.value = existingPlayerData.color;
            playerRole.value = 'player';
            console.log('existing player');
        }
    }
    console.log('roomstore changes');
})
</script>
<style lang="scss">
.join-room-page{
    display: grid;
    gap: 1rem;
    &>.join-room-form{
        // margin-block: auto;
    }
}
</style>