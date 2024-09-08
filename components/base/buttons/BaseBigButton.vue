<template>
    <button :class="['big-button bp-button outline', { active: props.active }, props.width]">
        <img :src="img" alt="">
        <div style="text-align: center;" aria-roledescription="label">{{ label }}</div>
        <p v-if="description" class="retro small">{{ description }}</p>
        <slot name="other"></slot>
    </button>
</template>
<script setup>
const props = defineProps({ width: String, label: String, img: String, description: String, active: { type: Boolean, default: false } });
</script>
<style lang="scss">
.big-button {
    max-width: 300px;
    text-align: center;
    display: flex;
    flex-direction: column;
    &.fc{
        width: 100%;
    }
    &>img {
        display: inline;
    }

    &>[aria-roledescription] {
        word-break: break-all;
    }
}
</style>