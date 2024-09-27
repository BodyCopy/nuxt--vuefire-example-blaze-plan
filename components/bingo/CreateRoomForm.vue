<template>
    <form class="form-room">
        <fieldset class="retro-form">
            <BaseInput v-model="roomName.value" label="Room name" retro :validated="roomName.validated"
                :error-text="roomName.errorText" :maxLength="20" :character-count="roomName.value.length"
                :helper-text="'Max 20 characters'"></BaseInput>
            <BaseInput v-model="password.value" label="Password" retro :validated="password.validated"
                :error-text="password.errorText"></BaseInput>
            <!-- todo add the burnpad typeAhead chipInput -->
            <BaseInput v-model="nickname.value" label="Nickname" retro :validated="nickname.validated"
                :error-text="nickname.errorText"></BaseInput>
            <BaseSelect v-model="game.value" label="Game" retro></BaseSelect>
            <BaseToggle v-model="game.custom" label="Custom game" retro :statusText="true"></BaseToggle>
            <BaseInput v-model="template.value" label="Template" retro :validated="template.validated"
                :error-text="template.errorText"></BaseInput>
            <BaseButton btn-modifier="micro" @click.prevent="() => { $emit('custom-template', true) }">Upload JSON
            </BaseButton>
            <BaseButton btn-modifier="micro" @click.prevent="() => { $emit('custom-template', true) }">New template
            </BaseButton>
            <BaseButtonSet v-model="gameType.value" :options="gameType.options" label="Game type" width="fc">
            </BaseButtonSet>
            <BaseButtonSet v-model="gameMode.value" :options="gameMode.options" label="Game mode" width="fc">
            </BaseButtonSet>
            <BaseBoolean v-model="hideBoardInitially" label="Hide board initially?"></BaseBoolean>
            <BaseInput v-model="seed.value" label="Seed" retro :validated="seed.validated" :error-text="seed.errorText"
                helper-text="Leave empty for a random seed"></BaseInput>
        </fieldset>
        <fieldset>
            <PlayerColorSelector v-model="playerColor.value"></PlayerColorSelector>
            {{ playerColor.value }}
        </fieldset>
    </form>
</template>
<script lang="ts" setup>
import bcrypt from 'bcryptjs';
// Analytics can only be retrieved on the client
const user = useCurrentUser()

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
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: '',
    custom: false
})
const template = reactive({
    value: '',
    validated: true,
    errorText: 'Invalid',
    pattern: '',
    custom: false
})
const gameType = reactive({
    options: { Single: 'single', 'Multi-card': 'multi' },
    value: 'single',
    validated: true,
    errorText: 'Invalid',
    pattern: '',
})
const gameMode = reactive({
    options: { Standard: 'standard', 'Lock-out': 'lockOut' },
    value: 'standard',
    validated: true,
    errorText: 'Invalid',
    pattern: '',
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


const hideBoardInitially = ref(false);
</script>
<style lang="scss">
.form-room {
    display: grid;
}
</style>