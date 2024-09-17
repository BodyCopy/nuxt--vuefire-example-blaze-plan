<template>
    <div class="bingo-container">
        <div class="bingo-card">
            <div class="bingo-row" v-for="(row, rIndex) in bingoItemsArray">
                <BingoItem v-for="(col, cIndex) in row" :item="col" @click="toggleItemCompletion([rIndex, cIndex])">
                </BingoItem>
            </div>
            <div class="bingo-graphics" v-for="item in bingos" :class="{ bingo: item }">
                <b></b>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRoomStore } from '~/stores/roomData';
import RoomData from './RoomData.vue';
const props = defineProps({ bingoItems: Array, bingos: Array });
const bingoItemsArray = computed(() => {
    let output = [];
    for (let i = 0; i < props.bingoItems.length; i += 5) {
        output.push(props.bingoItems.slice(i, i + 5));
    }
    return output;
});
const toggleItemCompletion = inject('toggleItemCompletion');

</script>
<style lang="scss">
@import '~/assets/css/01-config/mixins.module.scss';

.bingo {
    &-container {
        container: bingo-card / size;
        height: calc(100svh - 3rem);
        aspect-ratio: 1/1;

        @include mediaTabletLandscape('max') {
            border: 1px solid red;
            height: calc(100svw * 1.333); //todo:convert bingoitems to portraitish as screen a/r changes
            aspect-ratio: 1/1.333;
        }
    }

    &-card {
        background-color: rgba(255, 255, 0, 0.16);
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 1fr);
        gap: 1px;
        aspect-ratio: 1/1;
        height: 100cqmin;
        width: auto;

        @include mediaTabletLandscape('max') {
            height: calc(100svw * 1.333);
            aspect-ratio: 1/1.333;
        }
    }

    &-row {
        display: grid;
        grid-column: 1/-1;
        gap: 1px;
        grid-template-columns: repeat(5, 1fr);

        &:nth-of-type(1) {
            grid-row: 1/1;
        }

        &:nth-of-type(2) {
            grid-row: 2/3;
        }

        &:nth-of-type(3) {
            grid-row: 3/4;
        }

        &:nth-of-type(4) {
            grid-row: 4/5;
        }

        &:nth-of-type(5) {
            grid-row: 5/6;
        }
    }

    &-graphics {
        &:nth-of-type(6) {
            grid-row: 1 / 2;
        }

        &:nth-of-type(7) {
            grid-row: 2/3;
        }

        &:nth-of-type(8) {
            grid-row: 3/4;
        }

        &:nth-of-type(9) {
            grid-row: 4/5;
        }

        &:nth-of-type(10) {
            grid-row: 5/6;
        }

        &:nth-of-type(11) {
            grid-row: 1/-1;
            grid-column: 1/2;
        }

        &:nth-of-type(12) {
            grid-row: 1/-1;
            grid-column: 2/3;
        }

        &:nth-of-type(13) {
            grid-row: 1/-1;
            grid-column: 3/4;
        }

        &:nth-of-type(14) {
            grid-row: 1/-1;
            grid-column: 4/5;
        }

        &:nth-of-type(15) {
            grid-row: 1/-1;
            grid-column: 5/6;
        }

        &:nth-of-type(16),
        &:nth-of-type(17) {
            inset: 0;
            margin: auto;
            position: absolute;
            height: 4px;
            width: 100%;
            background-color: transparent;
            transition: transform 240ms ease-in;
            transform-origin: center center;
        }
    }

    &-item {}

}

@keyframes bingo {
    0% {
        border: 3px solid transparent
    }

    50% {
        border: 3px solid chartreuse;
    }

    100% {
        border: 3px solid transparent;
    }
}

.bingo-graphics {
    pointer-events: none;
    grid-column: 1/-1;
}

.bingo-graphics.bingo {
    animation: 2s ease-in both 4 bingo;
}

.bingo-graphics {

    &:nth-of-type(16) {
        transform: rotate(45deg) scaleX(0);
    }

    &:nth-of-type(17) {
        transform: rotate(-45deg) scaleX(0);
    }

    &.bingo {

        &:nth-of-type(16),
        &:nth-of-type(17) {
            background-color: aqua;
        }

        &:nth-of-type(16) {
            transform: rotate(45deg) scaleX(1.425);
        }

        &:nth-of-type(17) {
            transform: rotate(-45deg) scaleX(1.425);
        }
    }
}
</style>
