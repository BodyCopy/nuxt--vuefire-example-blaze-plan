<template>
    <form action="">
        <fieldset class="retro-form">
            <BaseInput v-model="nickname.value" label="Nickname" retro :validated="nickname.validated"
                :error-text="nickname.errorText" placeholder="Your gamer name"></BaseInput>
            <BaseInput v-model="password.value" placeholder="-secret-" label="Password" retro
                :validated="password.validated" :error-text="password.errorText"></BaseInput>
            <!-- todo add the burnpad typeAhead chipInput -->
            <BaseButtonSet label="Joining as" v-model="playerRole.value" width="fc" :options="playerRole.options"></BaseButtonSet>
            <PlayerColorSelector v-model="playerColor.value"></PlayerColorSelector>
        </fieldset>
        <ArrowSeperator />
        <ActionBar>
            <BaseButton :disabled="buttonDisabled" btn-style="filled" width="fc">Join room</BaseButton>
        </ActionBar>
    </form>
</template>
<script setup>
const emits = ['join-room'];
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
    validated: true,
    errorText: 'Invalid',
    pattern: ''
})
const playerRole = reactive({
    value: null,
    errorText: 'Select your role',
    options: { Player: 'player', Spectator: 'spectator' },
    get validated() {
        return !!this.value;
    }
})
</script>