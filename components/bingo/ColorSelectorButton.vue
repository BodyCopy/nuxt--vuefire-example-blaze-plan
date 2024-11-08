<template>
    <component :is="flat ? 'div' : 'button'" :disabled="!props.isAvailable"
        :class="['color-selector-button', 'bingo-color', color, selected ? 'selected' : '', flat ? 'flat' : '']">
        <img :src="colorIcon" alt="">
        <p v-if="playerCount">{{ props.playerCount }}</p>
    </component>
</template>
<script setup>
import { icons } from './colors/icons.js';
const props = defineProps({
    color: String,
    selected: Boolean,
    isAvailable: { type: Boolean, default: true },
    flat: { type: Boolean, default: false },
    playerCount: Number,
})
const colorIcon = computed(() => {
    return icons[props.color];
})


</script>
<style lang="scss">
.color-selector-button {
    width: 100%;
    display: flex;
    justify-content: center;
    --selector-button-color: black;
    background-color: var(--selector-button-color);
    padding: 0.375rem;
    border-radius: 0.375rem;
    border: 0.5px solid rgba(18, 18, 18, 0.9);
    max-height: 2.5rem;
    z-index: 1;

    &:not(.flat) {
        box-shadow: var(--tile-box-shadow);
        transition: filter 160ms ease-in box-shadow 160ms ease-in;
    }

    //creating a stacking context kind of breakst the effect
    //todo 
    // &:hover {
    //     filter: brightness(0.9);
    // }

    // &:active {
    //     filter: brightness(0.8);
    //     box-shadow: var(--tile-box-shadow-pressed);
    // }

    &[disabled]:not([disabled="false"]) {
        cursor: not-allowed;
        filter: opacity(0.4) saturate(0.8);
    }

    &.selected {
        position: relative;

        &:after {
            // border-radius: 0.25rem;
            // z-index: -1;
            // content: '';
            // position: absolute;
            // inset: calc(var(--selected-border-size) * -1);
            // /* Linear gradient with rainbow colors */
            // // background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet, red, orange, yellow, green, blue, indigo, violet, red);

            // // /* Set the background size large enough for continuous movement */
            // // background-size: 400% 100%;
            // // /* Ensures the gradient can smoothly animate */
            // // animation: rainbow 8s linear infinite;
            // /* Animate the gradient */
            // --angle: 0deg;
            // border: 1px solid;
            // border-image: conic-gradient(from var(--angle), red, yellow, lime, aqua, blue, magenta, red) 1;

            // animation: 4s rotate linear infinite;
        }
    }

    &[disabled="true"],
    &.selected {
        box-shadow: var(--tile-box-shadow-pressed);
    }

    &:active,
    &[disabled],
    &.selected {
        &>img {
            // transform: translateY(0.125rem);
            // scale: 0.98;
        }
    }
}

.selected {}
</style>