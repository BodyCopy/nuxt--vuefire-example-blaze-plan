<template>
    <div class="placeholder">
        &nbsp;
    </div>
</template>
<script setup>
const props = defineProps(['height', 'width', 'border-radius']);
</script>
<style scoped>
@keyframes placeholderShimmer {
    0% {
        background-position: 0% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

.placeholder {

    height: v-bind(height);
    width: v-bind(width);
    border-radius: v-bind(borderRadius);
    background-image: linear-gradient(to right,
            var(--grey-99) 0%,
            var(--grey-90) 33%,
            var(--grey-95) 70%,
            var(--grey-99) 100%);
    background-size: 200px 100%;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);

    animation: placeholderShimmer 1s infinite linear;
}
</style>