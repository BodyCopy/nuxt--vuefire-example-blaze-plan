<template>
    <div class="fake-input">
        <label for="color-selector">Color selector</label>
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
import RedSword from '~/assets/icons/bingo-weapons/Red-Sword.svg';
import OrangeBomb from '~/assets/icons/bingo-weapons/Orange-Bomb.svg';
import YellowBow from '~/assets/icons/bingo-weapons/Yellow-Bow.svg';
import GreenShield from '~/assets/icons/bingo-weapons/Green-Shield.svg';
import TealSpell from '~/assets/icons/bingo-weapons/Teal-Spell.svg';
import BlueAxe from '~/assets/icons/bingo-weapons/Blue-Axe.svg';
import PurpleMace from '~/assets/icons/bingo-weapons/Purple-Mace.svg';
import PinkSharuken from '~/assets/icons/bingo-weapons/Pink-Sharuken.svg';
const colors = ref([
    { color: 'red', asset: RedSword, available: true, selected: false },
    { color: 'orange', asset: OrangeBomb, available: true, selected: false },
    { color: 'yellow', asset: YellowBow, available: true, selected: false },
    { color: 'green', asset: GreenShield, available: true, selected: false },
    { color: 'teal', asset: TealSpell, available: true, selected: false },
    { color: 'blue', asset: BlueAxe, available: false, selected: false },
    { color: 'purple', asset: PurpleMace, available: true, selected: false },
    { color: 'pink', asset: PinkSharuken, available: true, selected: false }
])
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