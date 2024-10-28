<template>
    <TopNav></TopNav>
    <main v-if="userIsLoaded || user" class="room-layout fixed-layout">
        <!-- <h1>{{ route.meta.title }}</h1> -->
        <slot></slot>
        <svg xmlns='http://www.w3.org/2000/svg' class="invisible-element" aria-hidden="true">
            <filter id='noiseFilter' primitive-units="objectBoundingBox" height="120%">
                <feTurbulence type='fractalNoise' baseFrequency='5' numOctaves='5' stitchTiles='stitch' />
            </filter>
        </svg>
    </main>
</template>
<script setup>
import { useUserStore } from '~/stores/userStore';
const { user, userNickname, userIsLoaded } = useUserStore();
</script>
<style lang="scss">
.form-room {
    display: grid;
}

//contains the codes for the differant player colors
.bingo-color {
    &.red {
        --selector-button-color: hsl(9, 98%, 59%, 1);
    }

    &.orange {
        --selector-button-color: #FD7427;
    }

    &.yellow {
        --selector-button-color: #FFB401;
    }

    &.green {
        --selector-button-color: #00820B;
    }

    &.teal {
        --selector-button-color: #0ABBD3;
    }

    &.blue {
        --selector-button-color: #4279FA;
    }

    &.purple {
        --selector-button-color: #9747FF;
    }

    &.pink {
        --selector-button-color: #FF00E5;
    }
}
</style>