<template>
    <div :class="['fake-input', fakeInputStyles]">
        <dt class="fake-input__title">
            <slot name="d-title">
                {{ props.title }}
            </slot>
        </dt>
        <dd class="fake-input__data">
            <slot name="d-data">
                {{ props.data }}
            </slot>
        </dd>
    </div>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps({ title: String, data: String, display: { type: String, default: 'vertical' }, inputStyle: { type: String, default: 'neutral' } });
const fakeInputStyles = computed(() => {
    return {
        'vertical': props.display === 'vertical',
        'horizontal': props.display === 'horizontal',
        'neutral': props.inputStyle === 'neutral',
        'orange': props.inputStyle === 'orange',
    }
})
</script>
<style lang="scss">
.fake-input {
    display: flex;
    flex-direction: column;

    &__data {
        flex-grow: 1;

        &:has(.base-image) {
            overflow: hidden;
        }

        &>h1,
        h2,
        h3,
        h4 {
            color: var(--B-05, #A3A8B2);
            font-family: "IBM Plex Sans Var";
            font-weight: 428;
            line-height: 100%;
            letter-spacing: -0.05em;
        }

        &>ul {
            margin-block-end: 0.25rem;

            &>*+* {
                margin-block-start: 0.125rem;
            }

        }
    }

    &.horizontal {
        flex-direction: row;
    }

}

@container fake-input-grid-container (width < 300px) {}</style>