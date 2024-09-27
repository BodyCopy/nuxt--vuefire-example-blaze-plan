<template>
    <ul class="line-item-grid">
        <slot name="grid-items"></slot>
    </ul>
</template>
<script setup>

</script>
<style lang="scss">
.line-item-grid{
    display: grid;
    grid-template-columns: 1fr;
}
</style>