<template>
    <div ref="itemCell" :class="['bingo-item', { complete: item.complete }]">
        <p ref="itemText">{{ item.name }}</p>
    </div>
</template>
<script setup>

const props = defineProps({ item: Object });
const itemText = ref(null);
const itemCell = ref(null);
// const text = reactive(useElementSize(itemText));
let initialTextSize = null;

const cell = reactive(useElementBounding(itemCell));

let debounceTimeout = null;

// watch(cell, (nV, oV) => {
//     checkFontSize();
// });
onMounted(() => {
    initialTextSize = itemText.value.scrollHeight;
    checkFontSize();
})

function checkFontSize() {
    if (itemText.value) {
        // Avoid flickering by calculating once and adding a slight delay
        const containerHeight = cell.height;  // Height of the div

        let ratio = (containerHeight - 8) / initialTextSize;

        // Only resize when the ratio is significantly different
        if (Math.abs(1 - ratio) > 0.01) {  // 5% threshold to avoid unnecessary resizing
            if (ratio > 1) {
                itemText.value.style.fontSize = `1em`;  // Reset to default
            } else if (ratio < 1) {
                // Scale down the text size based on the ratio
                itemText.value.style.fontSize = `${ratio}em`;
            }
        }
    }
}

</script>
<style lang="scss">
.bingo-item {
    font-size: clamp(14px, 2.4cqmin, 20px);
    padding: 0.25em;
    display: grid;
    place-items: center;
    aspect-ratio: 1/1;
    overflow: hidden;
    background-color: var(--S-40);
}

.complete {
    background-color: var(--player-color, red);
}
</style>