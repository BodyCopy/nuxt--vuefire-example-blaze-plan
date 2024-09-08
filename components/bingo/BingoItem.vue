<template>
    <div ref="itemCell" :class="['bingo-item', { complete: item.complete }]">
        <p ref="itemText">{{ item.name }}</p>
    </div>
</template>
<script setup>

const props = defineProps({ item: Object });
const itemText = ref(null);
const itemCell = ref(null);
const scaleRatio = ref(null);
const text = reactive(useElementSize(itemText));
// const cell = useElementSize(itemCell);

const cell = reactive(useElementBounding(itemCell));

let debounceTimeout = null;

watch(cell, (nV, oV) => {
    checkFontSize();
});
onMounted(() => {
    checkFontSize();
})

function checkFontSize() {
    if (itemText.value) {
        // Avoid flickering by calculating once and adding a slight delay
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            const textHeight = itemText.value.scrollHeight;  // Get the actual height of the text content
            const containerHeight = cell.height - 16;  // Height of the div

            let ratio = containerHeight / textHeight;

            // Only resize when the ratio is significantly different
            if (Math.abs(1 - ratio) > 0.05) {  // 5% threshold to avoid unnecessary resizing
                if (ratio > 1) {
                    // If the text fits, reset to normal size
                    if (scaleRatio.value && (3 - ratio) <= scaleRatio.value) {
                        scaleRatio.value = null;
                        itemText.value.style.fontSize = `1rem`;  // Reset to default
                    }
                } else if (ratio < 1) {
                    // Scale down the text size based on the ratio
                    scaleRatio.value = ratio;
                    itemText.value.style.fontSize = `${ratio * 100}%`;
                }
            }
        }, 100);  // Debounce time to prevent frequent re-evaluation
    }
}
// function resizeTextIfTooBig() {
//     console.log(text.value.width, text.value.height);
// }
//, { complete: item.complete }
//measure the height of the text
// cell divided by the height of the text
// if remainder is < 1
// mulitple the text size by 1 - the remainded;
</script>
<style lang="scss">
.bingo-item {
    display: grid;
    place-items: center;
    aspect-ratio: 1/1;
    overflow: hidden;
    padding: 0.5rem;
    background-color: var(--S-40);
}

.complete {
    background-color: var(--player-color, red);
}
</style>