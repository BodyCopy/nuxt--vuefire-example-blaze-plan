<template>
    <dialog class="base-modal">
        <div class="base-modal__heading">
            <h4 class="base-modal__heading-content">
                <slot name="heading"></slot>
            </h4>
            <BaseIconButton @click="() => { $emit('dismiss') }">
                <IconX />
            </BaseIconButton>
        </div>
        <div class="base-modal__content thin-scrollbar">
            <slot name="content"></slot>
        </div>
        <div class="base-modal__actions">
            <slot name="actions"></slot>
            <BaseButton v-if="props.cancelBtn" @click="$emit('dismiss')" btnStyle="ghost">Cancel</BaseButton>
        </div>
    </dialog>
</template>
<script setup>
import IconX from '@/components/icons/IconX.vue';
import { ref } from 'vue';
const props = defineProps(['message', 'cancelBtn']);
const emits = defineEmits(['dismiss']);
</script>
<style lang="scss">
.base-modal {
    background-color: black;
    //dialogue resets
    padding: 0;
    border: none;
    border-radius: 4px;
    width: 80dvw;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    display: grid;
    grid-template-rows: max-content max(80svh, 400px);

    &__heading {
        display: flex;
        padding-block: 0.5rem;
        border-block-end: var(--line-break);

        &-content {
            flex-grow: 1;
            margin-right: auto;
        }
    }

    &__content {
        overflow-y: auto;
    }

    &__actions {
        padding-block: 0.5rem;
        border-block-start: var(--line-break);
        display: flex;
        justify-content: end;
        gap: 1rem;
    }
}
</style>