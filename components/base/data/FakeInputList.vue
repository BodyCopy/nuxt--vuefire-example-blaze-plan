<template>
    <div class="fake-input-list-wrapper">
        <div v-if="heading" class="fake-input-list__heading">{{ heading }}</div>
        <dl class="fake-input-list">
            <slot name="list-data">

            </slot>
        </dl>
    </div>
</template>
<script setup>
import FakeInput from './FakeInput.vue';
const props = defineProps({ items: { type: Array }, heading: { type: String, default: null } });
</script>
<style lang="scss">
.fake-input-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1px;
    background-color: var(--grid-line-color);

    &__heading {
        padding: 0.5rem;
        padding-block-end: calc(0.5rem - 2px);
        background-color: var(--background-color);
        color: var(--O-60, #993D00);
        // font-family: "IBM Plex Sans";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px;
        /* 150% */
        letter-spacing: 0.16px;
        border-bottom: 0.8px solid var(--grid-line-color);
    }

    &>.fake-input {}
}
</style>