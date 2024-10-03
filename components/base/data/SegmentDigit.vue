<template>
    <svg v-if="val !== ':'" xmlns="http://www.w3.org/2000/svg" width="20" height="29" viewBox="0 0 40 58" fill="none"
        stroke-width="0" stroke="transparent" class="segment-digit">
        <defs>
            <polygon id="horizontal-segment" points="3,3 6,0 17,0 20,3 17,6 6,6"></polygon>
            <polygon id="vertical-segment" points="0,6 3,3 6,6 6,26 3,29 0,26" style="" />
            <polygon id="diagonal-segment-back" points="6,6 8,6 17,21 17,26 14,26 6,13" style="" />
            <polygon id="diagonal-segment-forward" points="34,6 34,13 26,26 23,26 23,21 32,6" style="" />
        </defs>
        <use id="seg-0" :class="['seg', { ['active-seg']: output[0] }]" href="#horizontal-segment" x="0" y="0" />
        <use id="seg-1" :class="['seg', { ['active-seg']: output[1] }]" href="#horizontal-segment" x="17" y="0" />
        <use id="seg-2" :class="['seg', { ['active-seg']: output[2] }]" href="#vertical-segment" x="34" y="0" />
        <use id="seg-3" :class="['seg', { ['active-seg']: output[3] }]" href="#vertical-segment" x="34" y="26" />
        <use id="seg-4" :class="['seg', { ['active-seg']: output[4] }]" href="#horizontal-segment" x="17" y="52" />
        <use id="seg-5" :class="['seg', { ['active-seg']: output[5] }]" href="#horizontal-segment" x="0" y="52" />
        <use id="seg-6" :class="['seg', { ['active-seg']: output[6] }]" href="#vertical-segment" x="0" y="26" />
        <use id="seg-7" :class="['seg', { ['active-seg']: output[7] }]" href="#vertical-segment" x="0" y="0" />
        <use id="seg-8" :class="['seg', { ['active-seg']: output[8] }]" href="#vertical-segment" x="17" y="0" />
        <use id="seg-9" :class="['seg', { ['active-seg']: output[9] }]" href="#horizontal-segment" x="17" y="26" />
        <use id="seg-10" :class="['seg', { ['active-seg']: output[10] }]" href="#vertical-segment" x="17" y="26" />
        <use id="seg-11" :class="['seg', { ['active-seg']: output[11] }]" href="#horizontal-segment" x="0" y="26" />
        <use id="seg-12" :class="['seg', { ['active-seg']: output[12] }]" href="#diagonal-segment-back" x="0" y="0" />
        <use id="seg-13" :class="['seg', { ['active-seg']: output[13] }]" href="#diagonal-segment-forward" x="0"
            y="0" />
        <use id="seg-14" :class="['seg', { ['active-seg']: output[14] }]" href="#diagonal-segment-back" x="17" y="26" />
        <use id="seg-15" :class="['seg', { ['active-seg']: output[15] }]" href="#diagonal-segment-forward" x="-17"
            y="26" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="9" height="29" viewBox="0 0 18 58" fill="none"
        stroke-width="0" stroke="transparent" class="segment-digit">
        <circle class="active-seg" cx="9" cy="16" r="5" />
        <circle class="active-seg" cx="9" cy="46" r="5" />
    </svg>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, watchEffect } from 'vue';
const props = defineProps(['val', 'freakout']);

const segmentMap = {
    a: [1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    b: [1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0],
    c: [1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    d: [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    e: [1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    f: [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    g: [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    h: [0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    i: [1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    j: [1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    k: [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0],
    l: [1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    m: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0],
    n: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0],
    o: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    p: [1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    q: [1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    r: [1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0],
    s: [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    t: [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    u: [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    v: [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    w: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0],
    z: [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    '1': [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    '2': [1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    '3': [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    '4': [0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    '5': [1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    '6': [0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    '7': [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    '8': [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    '9': [1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    '0': [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    '*': [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    '-': [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    '+': [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    '=': [1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    '/': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    '\\': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    '.': [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

}
const output = ref([]);
const deepCopyArray = (arr) => arr.map(item => item);
const setOutput = (val) => {
    if (props.freakout) {
        //something might be wrong here
        output.value = deepCopyArray(segmentMap[val] || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    } else {
        output.value = segmentMap[props.val];
    }
};
const scrambleIntervalMs = 80; // Adjust this to change the scramble speed

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
        setOutput('*');
        setTimeout(() => { setOutput(props.val) }, 1000);
        // setOutput(props.val); // Reset to initial state
    }
};

defineExpose({ startScramble, stopScramble });

onMounted(() => {
    setOutput(props.val);
});
watchEffect(() => {
    setOutput(props.val);
})

onUnmounted(() => {
    if (scrambleInterval && props.freakout) {
        clearInterval(scrambleInterval);
    }
});
</script>
<style>
.segment-digit {}

.seg {
    fill: var(--S-35a);
    transition: fill 96ms linear;
}

.active-seg {
    fill: hsla(var(--active-seg-color, 0, 0%, 96%), 1);
    filter: drop-shadow(0 0 calc(var(--segment-display-height) / 6) hsla(var(--active-seg-color, 0, 0%, 96% ), 0.706));
    /* fill: #CD9BEC;
    filter: drop-shadow(0 0 4px #CD9BEC); */
}
</style>