<template>
    <time class="time-stamp">{{ timeStamp }}</time>
</template>
<script setup>
import { computed } from 'vue';
import { useUtility } from '@/composables/utility.js';
const { formatTimestamp } = useUtility();
const props = defineProps({ time: Date });
const timeStamp = computed(() => {
    if (!props.time) {
        //snapshot watcher doesn't recieve the serverTimestamp immediatly so this acts as a inbetween, it's reasonably accurate.
        return formatTimestamp(new Date());
    }
    else if (typeof props.time.toDate === 'function') {
        return formatTimestamp(props.time.toDate());
    } else {
        return formatTimestamp(props.time);
    }
}
)
</script>
<style>
.time-stamp {
    color: inherit;
    font-size: inherit;
}
</style>