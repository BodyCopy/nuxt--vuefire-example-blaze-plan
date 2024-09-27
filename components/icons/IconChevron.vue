<template>
    <svg v-if="direction === 'up'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="var(--svg-stroke-width)" stroke-linecap="round" stroke-linejoin="round"
        class="feather feather-chevron-up">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
    <svg v-else="direction === 'down'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="var(--svg-stroke-width)" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
</template>
<script setup>
const props = defineProps(['direction']);
</script>
