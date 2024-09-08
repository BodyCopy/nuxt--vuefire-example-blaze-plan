<template>
    <div ref="display" class="segment-display" :aria-label="props.string">
        <SegmentDigit v-for="s of string" ref="digits" :val="s" :freakout="freakout" />
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import SegmentDigit from './SegmentDigit.vue';
const props = defineProps({ string: String, freakout: Boolean });
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
.segment-display {
    width: max-content;
}

.segment-digit {
    height: 100%;
}

.active-seg {
}

.segment-display>*+* {
    margin-inline-start: 0.25em;
}
</style>