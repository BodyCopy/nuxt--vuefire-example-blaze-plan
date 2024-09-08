<template>
    <div class="slider">
        <label for="cowbell">{{ props.label }}</label>
        <div class="control-wrapper">
            <BaseIconButton v-if="props.incrementButtons" btnModifier="micro" @click="update((props.step * -1))">
                <IconMinus />
            </BaseIconButton>
            <div :class="['slider-style-wrapper', { showSteps: showSteps }]">
                <!-- <div v-if="showSteps" class="showSteps"></div> -->
                <input v-model="model" @input="sliderUpdate" type="range" id="cowbell" name="cowbell" :min="props.min"
                    :max="props.max" :step="props.step" />
            </div>
            <BaseIconButton v-if="props.incrementButtons" btnModifier="micro" @click="update(props.step)">
                <IconPlus />
            </BaseIconButton>
            <BaseInput retro v-if="props.valueInput" @input="sliderUpdate" type="number" v-model="model" id="slider-input">
            </BaseInput>
            <!-- <input v-if="props.valueInput" @input="sliderUpdate" type="number" v-model="modelValue" id="slider-input"> -->
        </div>
    </div>
</template>
<script setup>
import IconMinus from '@/components/icons/IconMinus.vue';
import IconPlus from '@/components/icons/IconPlus.vue';
import { ref, computed } from 'vue';
import BaseIconButton from '../buttons/BaseIconButton.vue';
// const { autocomplete } = useAttrs();
//Is there a way to extend a prop set for example a lot of my custom controls share the same props? 
const props = defineProps({ showSteps: { type: Boolean, default: false }, incrementButtons: { type: Boolean, default: false }, valueInput: { type: Boolean, default: false }, label: String, min: Number, max: Number, step: { type: Number, default: 1 }, display: String })
const model = defineModel({ type: Number, default: 0 });
function sliderUpdate(e) {
    model.value = Number(e.target.value);
}
const modelTrack = computed(() => {
    return model.value + '%';
})
function update(value) {
    if (model.value + value <= props.max && model.value + value >= props.min) {
        model.value += value;
    }
    else {
        model.value = value > 0 ? props.max : props.min;
    }
}

</script>
<style lang="scss" scoped>
.slider {
    min-width: 200px;
    pointer-events: none;
}

.slider-style-wrapper {
    // border: 1px solid red;
    display: flex;
    flex-direction: row;
    position: relative;
    pointer-events: none;

    // &:before {
    //     z-index: 2;
    //     transform: translateX(-50%);
    //     width: max-content;
    //     position: absolute;
    //     inset: 0;
    //     left: v-bind(modelTrack);
    //     content: '<==>'
    // }

    &.showSteps {

        /* Adjust based on the number of steps */
        &:before {
            content: '';
            position: absolute;
            left: 0px;
            right: 0px;
            top: -0.25rem;
            // background-color: var(--S-20);
            height: 4px;
        }
    }


    // &:before {
    //     left: 1px;
    //     border-inline-start: 4px double var(--B-35);
    // }

    // &:after {
    //     right: 1px;
    //     border-inline-end: 4px double var(--B-35);

    // }
}

.control-wrapper {
    display: flex;
    flex-direction: row;
    gap: 0.125rem;
    align-items: center;
    border: var(--line-break);
    pointer-events: none;

    &>.icon-button {
        border-radius: 0;
    }

    &>.icon-button:first-of-type {
        border-inline-end: var(--line-break);
    }

    &>.icon-button:last-of-type {
        border-inline-start: var(--line-break);
    }
}

input[type="range"] {
    pointer-events: all;
    --_thumb-height: 20px;
    --_thumb-width: 20px;
    --_thumb-color: var(--background-color);
    isolation: isolate;
    margin: 0;
    -webkit-appearance: none;
    /* Removes default styling for WebKit browsers */
    appearance: none;
    cursor: pointer;
    width: 100%;
    height: 1rem;
    background: transparent;
    outline: none;
    opacity: 1;

    &::-moz-range-thumb {
        // opacity: 0;
        height: var(--_thumb-height);
        width: var(--_thumb-width);
        // background-color: var(--_thumb-color);
        box-shadow: none;
        border: transparent;
        border-radius: 0px;
        outline: 4px double var(--copy-color);
        outline-offset: -4px;
        padding-inline: 2rem;
        transition: outline 240ms ease-in-out;
        --line-color: var(--primary-color-base);
        background: var(--background-color);

        &:active {
            outline-width: 5px;
            --copy-color: var(--O-35);
        }
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: var(--_thumb-height);
        width: var(--_thumb-width);
        margin-block-start: calc(var(--_thumb-width) * -0.5);
        background-color: var(--_thumb-color);
        box-shadow: none;
        border: transparent;
        border-radius: 0px;
        outline: 4px double var(--copy-color);
        outline-offset: -4px;
        padding-inline: 2rem;
        transition: outline 240ms ease-in-out;

        &:active {
            outline-width: 5px;
            --copy-color: var(--O-35);
        }

    }

    &::-webkit-slider-runnable-track {
        height: 1px;
        background-color: var(--S-20);
    }

    &::-moz-range-track {
        width: 100%;
        height: 1px;
        background-color: var(--S-20);
        border-radius: 0px;
    }

    &:hover {
        &::-moz-range-thumb {}
    }

    &:active {
        &::-moz-range-thumb {
            outline-width: 5px;
            --copy-color: var(--O-35);
        }
    }
}
</style>