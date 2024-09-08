<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="29" viewBox="0 0 40 58" fill="none" stroke-width="0"
        stroke="transparent" class="segment-digit">
        <defs>
            <polygon id="horizontal-segment" points="3,3 6,0 17,0 20,3 17,6 6,6"></polygon>
            <polygon id="vertical-segment" points="0,6 3,3 6,6 6,26 3,29 0,26" style="" />
            <polygon id="diagonal-segment-back" points="6,6 8,6 17,21 17,26 14,26 6,13" style="" />
            <polygon id="diagonal-segment-forward" points="34,6 34,13 26,26 23,26 23,21 32,6" style="" />
        </defs>
        <use id="seg-0" :class="{ ['active-seg']: output[0] }" href="#horizontal-segment" x="0" y="0" />
        <use id="seg-1" :class="{ ['active-seg']: output[1] }" href="#horizontal-segment" x="17" y="0" />
        <use id="seg-2" :class="{ ['active-seg']: output[2] }" href="#vertical-segment" x="34" y="0" />
        <use id="seg-3" :class="{ ['active-seg']: output[3] }" href="#vertical-segment" x="34" y="26" />
        <use id="seg-4" :class="{ ['active-seg']: output[4] }" href="#horizontal-segment" x="17" y="52" />
        <use id="seg-5" :class="{ ['active-seg']: output[5] }" href="#horizontal-segment" x="0" y="52" />
        <use id="seg-6" :class="{ ['active-seg']: output[6] }" href="#vertical-segment" x="0" y="26" />
        <use id="seg-7" :class="{ ['active-seg']: output[7] }" href="#vertical-segment" x="0" y="0" />
        <use id="seg-8" :class="{ ['active-seg']: output[8] }" href="#vertical-segment" x="17" y="0" />
        <use id="seg-9" :class="{ ['active-seg']: output[9] }" href="#horizontal-segment" x="17" y="26" />
        <use id="seg-10" :class="{ ['active-seg']: output[10] }" href="#vertical-segment" x="17" y="26" />
        <use id="seg-11" :class="{ ['active-seg']: output[11] }" href="#horizontal-segment" x="0" y="26" />
        <use id="seg-12" :class="{ ['active-seg']: output[12] }" href="#diagonal-segment-back" x="0" y="0" />
        <use id="seg-13" :class="{ ['active-seg']: output[13] }" href="#diagonal-segment-forward" x="0" y="0" />
        <use id="seg-14" :class="{ ['active-seg']: output[14] }" href="#diagonal-segment-back" x="17" y="26" />
        <use id="seg-15" :class="{ ['active-seg']: output[15] }" href="#diagonal-segment-forward" x="-17" y="26" />
    </svg>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
const props = defineProps(['freakout']);
const output = ref([]);
const deepCopyArray = (arr) => arr.map(item => item);
const setOutput = (val) => {
    output.value = deepCopyArray(segmentMap[val] || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
};
const scrambleIntervalMs = 64; // Adjust this to change the scramble speed

let scrambleInterval;

const scrambleSegments = () => {
    for (let i = 0; i < output.value.length; i++) {
        output.value[i] = Math.random() > 0.5 ? 1 : 0;
    }
};

const startScramble = () => {
    if (!scrambleInterval && props.freakout) {
        scrambleSegments(); // Scramble immediately, then start interval
        scrambleInterval = setInterval(scrambleSegments, scrambleIntervalMs);
    }
};

const stopScramble = () => {
    if (scrambleInterval && props.freakout) {
        clearInterval(scrambleInterval);
        scrambleInterval = null;
        setOutput(props.val); // Reset to initial state
    }
};

defineExpose({ startScramble, stopScramble });

onMounted(() => {
    setOutput(props.val);
});

onUnmounted(() => {
    if (scrambleInterval && props.freakout) {
        clearInterval(scrambleInterval);
    }
});
</script>
<style>
.active-seg {
    fill: var(--Y-40);
    filter: drop-shadow(0 0 3px var(--Y-40));
}
</style>