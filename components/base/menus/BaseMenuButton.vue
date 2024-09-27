<template>
    <button class="menu-button">
        <BaseLoadingSpinner v-if="loading" class="small-spinner" />
        <slot name="icon"></slot>
        <slot></slot>
    </button>
</template>
<script setup>
const props = defineProps(['loading']);
</script>
<style lang="scss">
.menu-button {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    background-color: var(--grey-93);
    padding: 0.5rem 0.5rem;
    width: 100%;
    transition: all 0.24s ease-in;

    &:hover {
        filter: brightness(1.3);
    }

    &:active {
        color: var(--primary-color-base);
        filter: brightness(2);
    }

    &:focus {
        filter: brightness(var(--hover-brightness));
        outline: 1px dotted var(--O-55);
        outline-offset: -2px;
    }
}

.small-spinner {
    width: 19px;
    height: 19px;
}
</style>