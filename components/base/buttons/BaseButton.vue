<template>
    <NuxtLink v-if="to" :class="['btn', 'bp-button', props.disabled ? 'disabled' : '', buttonStyle]" :to="to">
        <slot name="icon"></slot>
        <span class="btn-content">
            <slot></slot>
        </span>
        <slot name="trailingIcon"></slot>
    </NuxtLink>
    <a v-else-if="href" :class="['btn', 'bp-button', buttonStyle]" :href="href">
        <slot></slot>
        <Icon name="external-link" />
    </a>
    <button v-else :disabled="props.disabled" :class="['btn', 'bp-button', buttonStyle]">
        <span v-if="loading" class="leading-icon">
            <BaseLoadingSpinner></BaseLoadingSpinner>
        </span>
        <slot name="icon"></slot>
        <span class="btn-content">
            <slot></slot>
        </span>
        <slot name="trailingIcon"></slot>
    </button>
</template>
<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import BaseLoadingSpinner from '@/components/base/loaders/BaseLoadingSpinner.vue';
const props = defineProps({ to: String, btnStyle: { type: String, default: 'outline' }, btnModifier: String, disabled: { type: Boolean, default: false }, loading: Boolean, width: String, href: String });

const buttonStyle = computed(() => {
    return {
        link: props.btnStyle === 'link',
        filled: props.btnStyle === 'filled',
        outline: props.btnStyle === 'outline',
        ghost: props.btnStyle === 'ghost',
        ['fill-content']: props.width === 'fc',
        destructive: props.btnStyle === 'destructive',
        condensed: props.btnModifier === 'condensed',
        micro: props.btnModifier === 'micro',
    }
});

</script>
<style lang="scss">
@import '@/components/base/buttons/button-styles.module.scss';
</style>