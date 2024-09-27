<template>
    <TopNav></TopNav>
    <div class="default-layout">
        <h2>{{ route.meta.title }}</h2>
        <slot></slot>
    </div>
</template>
<script setup>
const route = useRoute();
</script>
<style lang="scss">
.default-layout {
    padding: 1.5rem 0.5rem 1rem 0.5rem;
    display: grid;
    gap: 1rem;
}
</style>