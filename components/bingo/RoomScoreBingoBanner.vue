<template>
    <div :class="['room-score-bingo-banner', 'bingo-color', color]">
        <SegmentDisplay :string="playerBingo" :freakout="true"></SegmentDisplay>
    </div>
</template>
<script setup>
const props = defineProps({ color: String });
const playerBingo = computed(() => {
    return `.+*${props.color}-bingo*+.`;
})
const freakOutTimer = ref(true);
// onMounted(() => {
//     setTimeout(() => {
//         freakOutTimer.value = false;
//     }, 2000);
// })
</script>
<style lang="scss">
.room-score-bingo-banner {
    margin-block: auto;
    --segment-display-height: 1.25rem;
    --active-seg-color: var(--selector-button-color);
}
</style>