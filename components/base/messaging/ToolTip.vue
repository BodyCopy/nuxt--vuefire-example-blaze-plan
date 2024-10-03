<template>
    <div v-show="visible" class="tooltip" :style="{ top: position.top, left: position.left }">
        <slot></slot>
    </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const visible = ref(false);
const position = ref({ top: '0px', left: '0px' });

const show = (event) => {
    position.value = {
        top: `${event.clientY + 10}px`,
        left: `${event.clientX + 10}px`
    };
    visible.value = true;
};

const hide = () => {
    visible.value = false;
};

onMounted(() => {
    document.addEventListener('mousemove', show);
    document.addEventListener('mouseleave', hide);
});

onUnmounted(() => {
    document.removeEventListener('mousemove', show);
    document.removeEventListener('mouseleave', hide);
});
</script>
  
<style>
.tooltip {
    position: fixed;
    /* Add more styles for your tooltip */
}
</style>
  