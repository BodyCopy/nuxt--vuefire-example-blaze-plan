<template>
    <div ref="display" :class="['segment-display', displayBoard ? 'display-board' : '']" :aria-label="props.string">
        <SegmentDigit v-for="s of string" ref="digits" :val="s" :freakout="freakout" />
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import SegmentDigit from './SegmentDigit.vue';
const props = defineProps({ string: String, freakout: Boolean, displayBoard: Boolean });
const digits = ref(null);
const display = ref(null);
onMounted(() => {
    display.value.addEventListener('mouseover', scrambleDigits);
    display.value.addEventListener('mouseleave', stopScrableDigits);
    function scrambleDigits() {
        if (digits.value) {
            digits.value.forEach((d) => {
                d.startScramble()
            });
        }
    }
    function stopScrableDigits() {
        if (digits.value) {
            digits.value.forEach(d => d.stopScramble());
        }
    }

})
</script>
<style>
.display-board{
    border-radius: 4px;
    border: 1px solid var(--S-35);
    padding: 3px;
}
.segment-display {
    height: var(--segment-display-height, 1rem);
    width: max-content;
}

.segment-digit {
    height: 100%;
    width: auto;
}

.active-seg {}

.segment-display>*+* {
    margin-inline-start: calc(var(--segment-display-height) / 6);
}
</style>