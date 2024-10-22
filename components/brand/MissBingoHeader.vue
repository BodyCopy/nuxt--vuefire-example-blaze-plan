<template>
    <NuxtLink to="/">
        <div class="miss-bingo-header">
            <img :src="MissBingoLogo">
            <SegmentDisplay string="miss.bing0"></SegmentDisplay>
        </div>
    </NuxtLink>
</template>
<script setup>
import MissBingoLogo from '~/public/MissBingoLogo.svg';
</script>
<style lang="scss">
.miss-bingo-header {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    &>.segment-display {
        --active-seg-color: 277, 68%, 77%;
        --segment-display-height: 1rem;
    }
}
</style>