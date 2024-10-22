<template>
    <div :class="['loader-screen', 'dot-grid-paper', props.height]">
        <div v-if="!timedOut" class="ttb-layout">
            <LoaderFolder height="200px" />
            <p class="loading-text retro">{{ loading }}</p>
        </div>
        <div v-else>
        <p>Timed out</p>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LoaderFolder from './LoaderFolder.vue';
const props = defineProps({ height: String });
const loading = ref('Loading');
const timedOut = ref(false);
let loadingDots;
let startTimeout;
onMounted(() => {
    startTimeout = setTimeout(() => {
        timedOut.value = true;
    }, 8000)
    let loadingText = 'Loading';
    let loadingState = 0;
    function updateLoadingText() {
        loadingState = (loadingState + 1) % 4;
        let text = loadingText;
        for (let i = 0; i < 3; i++) {
            text += loadingState > i ? '.' : '';
        }
        loading.value = text
    }
    loadingDots = setInterval(updateLoadingText, 200);
})
onUnmounted(() => {
    clearInterval(loadingDots);
    clearTimeout(startTimeout);
})
</script>
<style lang="scss">
.loader-screen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.5px solid var(--B-45);
    padding-bottom: calc((200px + 0.875rem) / 2);
}

.loading-text {
    width: 10ch;
    justify-self: start;
}
</style>