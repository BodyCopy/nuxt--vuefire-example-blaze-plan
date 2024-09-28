<template>
    <form @submit.prevent="joinRoom" action="">
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
        <JoinEnterRoomSection :player-color="playerColor.value" :nickname="nickname.value" :ready></JoinEnterRoomSection>
    </form>
</template>
<script setup>
const emits = defineEmits(['join-room']);
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