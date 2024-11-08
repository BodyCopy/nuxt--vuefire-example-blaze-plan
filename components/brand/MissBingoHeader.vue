<template>
    <NuxtLink to="/">
        <div class="miss-bingo-header">
            <img :src="MissBingoLogo">
            <div><slot>Miss.Bingo</slot></div>
            <!-- <SegmentDisplay string="miss.bing0" :freakout="true"></SegmentDisplay> -->
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
    margin-block: auto;

    &>div {
        font-size: 1.5rem;
        font-variation-settings: "COUT" 282, "JMBL" 178, "STGR" 200;
        font-family: var(--font-pickllle);
        color: hsl(277, 68%, 77%);
        line-height: 1em;
    }

    &>.segment-display {
        --active-seg-color: hsl(277, 68%, 77%);
        --segment-display-height: 1rem;
    }
}
</style>