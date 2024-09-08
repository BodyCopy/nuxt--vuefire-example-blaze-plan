<template>
    <span class="ascii-chip">[#<slot></slot>]</span>
</template>
<script setup>
const props = defineProps(['content']);
</script>
<style lang="scss">
.ascii-chip{
    &:hover{
        background-color: var(--temp-freeze);
    }
    cursor: pointer;
    transition: background-color 164ms ease-in;
    padding: 0.25rem;
    font-size: 1rem;
}
</style>