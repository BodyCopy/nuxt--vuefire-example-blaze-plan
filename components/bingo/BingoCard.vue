<template>
    <div class="bingo-container">
        <div class="bingo-card">
            <div class="bingo-row" v-for="(row, rIndex) in bingoItemsArray">
                <BingoItem v-for="(col, cIndex) in row" :item="col"
                    @click="updateBingoItem([rIndex, cIndex], 'complete', !col.complete)">
                </BingoItem>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRoomStore } from '~/stores/roomData';
const props = defineProps({ bingoItems: Array });
const route = useRoute();
const id = route.params.id;
const { updateBingoItem } = useRoomStore(id);

const bingoItemsArray = computed(() => {
    let output = [];
    for (let i = 0; i < props.bingoItems.length; i += 5) {
        output.push(props.bingoItems.slice(i, i + 5));
    }
    return output;
});

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
            height: 100svw;
        }
    }

    &-card {
        background-color: rgba(255, 255, 0, 0.16);
        display: grid;
        gap: 1px;
        aspect-ratio: 1/1;
        height: 100cqmin;
        width: auto;
    }

    &-row {
        display: grid;
        gap: 1px;
        grid-template-columns: repeat(5, 1fr);
    }

    &-item {}
}
</style>
