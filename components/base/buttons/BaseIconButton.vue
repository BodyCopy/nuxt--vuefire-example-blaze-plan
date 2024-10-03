<template>
    <RouterLink v-if="to" :class="['icon-button', btnStyle]" :to="to">
        <slot></slot>
    </RouterLink>
    <a v-else-if="href" :class="['icon-button', btnStyle]" :href="href">
        <slot></slot>
    </a>
    <button v-else :class="['icon-button', 'bp-button', btnStyle]">
        <slot></slot>
    </button>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps({ btnStyle: { type: String, default: 'ghost' }, btnModifier: String, to: String, href: String });
const btnStyle = computed(() => {
    return {
        neutral: props.btnStyle === 'neutral',
        filled: props.btnStyle === 'filled',
        ghost: props.btnStyle === 'ghost',
        outline: props.btnStyle === 'outline',
        condensed: props.btnModifier === 'condensed',
        micro: props.btnModifier === 'micro'
    }
})
</script>
<style lang="scss" scoped>
.icon-button {
    --_btn-background-color: transparent;
    background-color: var(--_btn-background-color);
    border: var(--border-color, none);
    cursor: pointer;
    display: inline-block;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.24s ease-in-out;

    &:hover {
        background-color: var(--grey-80);
    }

    &.condensed {
        border-radius: 4px;
        height: 1.75rem;
        width: 1.75rem;
        padding: 0.375rem 0.375rem;
    }

    &:active {
        fill: var(--primary-color-base);
        filter: brightness(2);
    }

    &.micro {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.125rem;
        padding: 0;
    }
}

.neutral {
    --_btn-background-color: var(--grey-90);

    &.filled {}

    &:hover {
        --_btn-background-color: var(--grey-85);
    }

}

.ghost {
    --_btn-background-color: transparent;
}
</style>