<template>
    <ul class="chip-wrapper">
        <slot></slot>
    </ul>
</template>
<script setup>
</script>
<style>
.chip-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.chip-wrapper>* {
    display: inline-flex;
}
</style>