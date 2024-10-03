<template>
    <TopNav></TopNav>
    <div class="room-layout fixed-layout">
        <!-- <h1>{{ route.meta.title }}</h1> -->
        <div>
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
const route = useRoute();
</script>
<style lang="scss">
.room-layout {}
</style>