<template>
    <div v-if="!hideCallout" ref="messageComponent" :class="['message-callout', calloutSyle, type]">
        <span v-if="!noIcon" class="icon">
            <IconCheckCircle v-if="type === 'success'"></IconCheckCircle>
            <IconAlertCircle v-else-if="type === 'error'"></IconAlertCircle>
            <IconZap v-else-if="type === 'info'"></IconZap>
            <IconInfo v-else></IconInfo>
        </span>
        <p :class="['message-content', { retro: props.retro }]">
            <slot></slot>
        </p>
        <BaseIconButton v-if="dismissable" @click="destroyComponent">
            <IconX></IconX>
        </BaseIconButton>
    </div>
</template>
<script setup>
import { ref, computed, } from 'vue';
import IconX from '@/components/icons/IconX.vue';
import IconCheckCircle from '@/components/icons/IconCheckCircle.vue';
import IconAlertCircle from '@/components/icons/IconAlertCircle.vue';
import IconInfo from '@/components/icons/IconInfo.vue';
import IconZap from '@/components/icons/IconZap.vue';
const calloutSyle = computed(() => {
    return {
        retro: props.retro,
        condensed: props.modifier,
    }
})
const emits = defineEmits(['dismiss']);
const props = defineProps({ retro: { type: Boolean, default: false }, type: { type: String, default: 'fyi' }, dismissable: Boolean, noIcon: Boolean });
const hideCallout = ref(false);
const messageComponent = ref(null);
function destroyComponent() {
    hideCallout.value = true;
}
</script>
<style lang="scss" scoped>
.message-callout {
    color: var(--content-color);
    border: 1px solid var(--border-color);
    background-color: var(--background-color);
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    gap: 1rem;
    &.retro{
        margin-block-end: 0.5rem;
        padding: 0.25rem 0.5rem;
        gap: 0.5rem;
    }
}

.message-content {
    margin: 0;
    &.retro{
        font-size: 0.75rem;
    }
}

.icon {
    --svg-stroke-color: var(--content-color);
    padding-top: 0.2rem;
}
</style>