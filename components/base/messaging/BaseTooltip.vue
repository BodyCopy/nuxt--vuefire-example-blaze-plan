<template>
    <div ref="tooltip" :class="['tooltip', { visible: tooltipState.visible }]" :style="tooltipStyle">
        {{ tooltipState.content }}
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { tooltipState } from './tooltipState';
const tooltip = ref(null);
const tooltipStyle = computed(() => ({
    position: 'fixed',
    top: `${tooltipState.position.top}px`,
    left: `${tooltipState.position.left}px`,
    // transform: 'translateX(25%)',
    // ... other styles
}));

</script>
  
<style>
.tooltip {
    pointer-events: none;
    position: fixed;
    font-size: 0.75rem;
    user-select: none;
    color: black;
    width: max-content;
    padding: 0.5rem;
    background-color: var(--grey-30);
    z-index: 999;
    border-radius: 0.25rem;
    opacity: 0;
    transition: opacity 160ms ease-in;
}

.visible {
    opacity: 1;
}
</style>