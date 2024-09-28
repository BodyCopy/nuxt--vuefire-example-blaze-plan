<template>
    <div :class="['join-section', ready ? 'ready' : '']" v-if="ready">
        <PlayerProfileCard :color="playerColor" :nickname="nickname"></PlayerProfileCard>
        <BaseButton type="submit" :disabled="submitDisabled" btn-style="outline" width="fc">{{ submitCopy }}
        </BaseButton>
    </div>
</template>
<script setup>
const props = defineProps({
    ready: { type: Boolean, default: false },
    submitDisabled: { type: Boolean, default: false },
    submitCopy: { type: String, default: '>>> Ready >>>' },
    playerColor: String,
    nickname: String,
})
</script>
<style lang="scss">
.join-section {
    padding: 0.5rem;
    display: grid;
    gap: 0.5rem;

    &.ready {
        --angle: 0deg;
        border: 2px solid;
        border-image: conic-gradient(from var(--angle), red, yellow, lime, aqua, blue, magenta, red) 1;

        animation: 4s rotate linear infinite;
    }
}
</style>