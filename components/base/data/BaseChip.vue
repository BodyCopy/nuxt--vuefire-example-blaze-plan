<template>
    <span :class="['chip', chipStyles]">
        <!-- <RouterLink v-if="props.to" :to="props.to"><slot></slot></RouterLink> -->
        <span>
            <slot>
            </slot>
        </span>

        <BaseIconButton @click.prevent="test" class="chip-delete" v-if="deletable">
            <IconX />
        </BaseIconButton>
    </span>
</template>
<script setup>
import IconX from '@/components/icons/IconX.vue';
import { computed } from 'vue';
function test() {
    console.log(props.index);
    emits('delete-chip', props.index);
}
const emits = defineEmits(['delete-chip']);
const props = defineProps(['type', 'size', 'deletable', 'index', 'readOnly']);
const chipStyles = computed(() => {
    return {
        med: props.size === 'med',
        hash: props.type === 'hash',
        deletable: props.deletable === true,
        readOnly: props.readOnly === true
    }
})
</script>
<style lang="scss" scoped>
.chip {
    color: var(--S-40, #0D0D0D);
    font-family: var(--font-ibm-mono);
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 128.571%;
    letter-spacing: 1px;
    height: max-content;
    position: relative;
    display: flex;
    width: max-content;
    border: 1px solid var(--O-60);
    background: var(--O-60);
    transition: padding 160ms ease-in;

    &.med {
        padding:  0.125rem 0.125rem calc(1px + 0.125rem) 0.125rem;
    }

    &.hash {
        &:before {
            content: '/';
        }

        &:after {
            content: '/';
        }
    }

    &.deletable:hover {
        padding-right: 1.5rem;
        filter: brightness(1.333);
        // background-color: var(--Y-30);

        .chip-delete {
            opacity: 1;
        }
    }

    &-delete {
        border-radius: 0;
        height: 100%;
        transition: opacity var(--default-fade);
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
        width: 1.5rem;
        border-left: 1px solid var(--S-40);
        --svg-stroke-color: var(--S-40);
    }

}
</style>