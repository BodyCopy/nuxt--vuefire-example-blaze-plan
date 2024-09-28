<template>
    <div class="fake-input">
        <label v-if="label" for="color-selector">{{ label }}</label>
        <ul id="color-selector" class="player-color-selector">
            <li v-for="(value, index) in colors" :key="value.color">
                <ColorSelectorButton @click.prevent="selected(index, value.color)" :color="value.color"
                    :icon="value.asset" :available="value.available" :selected="value.selected">
                </ColorSelectorButton>
            </li>
        </ul>
    </div>
</template>
<script setup>

const colors = ref([
    { color: 'red', available: true, selected: false },
    { color: 'orange', available: true, selected: false },
    { color: 'yellow', available: true, selected: false },
    { color: 'green', available: true, selected: false },
    { color: 'teal', available: true, selected: false },
    { color: 'blue', available: false, selected: false },
    { color: 'purple', available: true, selected: false },
    { color: 'pink', available: true, selected: false }
])
const props = defineProps({ label: { type: String, default: '' } })
const selectedColor = ref(false);
const model = defineModel({ type: [String, Number, Boolean], default: null })
function selected(index, option) {
    let value = option
    if (value === model.value) {
        selectedColor.value = false;
        colors.value[index].selected = false;
        model.value = '';
        return;
    }
    if (selectedColor.value) {
        colors.value = colors.value.map(c => ({ ...c, selected: false }));
    }
    colors.value[index].selected = !colors.value[index].selected;
    selectedColor.value = true;
    model.value = value;
}
</script>
<style lang="scss">
.player-color-selector {
    display: grid;
    gap: 0.25rem;
    grid-template-columns: repeat(8, 1fr);
}
</style>