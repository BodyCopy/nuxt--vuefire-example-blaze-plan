<template>
    <div ref="itemCell"
        :class="['bingo-item', 'bingo-color', completedColor, { ['player-focused']: playerFocused, complete: item.complete, bingo: item?.bingo }]"
        @click.right.prevent="() => { $emit('player-focus', playerFocused) }">
        {{ item.name }}
    </div>
</template>
<script setup>
import { textFit } from '~/utility/textFit';
import { useWindowSize } from '#imports';
const props = defineProps({ item: Object });
const completedColor = computed(() => {
    return props.item.complete || 'black';
})
const user = useCurrentUser()
const itemText = ref(null);
const itemCell = ref(null);
const playerFocused = computed(() => {
    if (user.value && props.item?.focusedBy) {
        return !!props.item.focusedBy.find(e => e === user.value.uid);
    } else {
        return false
    };
})

onMounted(() => {
    textFit(itemCell.value);
    window.addEventListener('resize', () => { textFit(itemCell.value) });
    // initialTextSize = itemText.value.scrollHeight;
    // checkFontSize();
})

</script>
<style lang="scss">
@import '~/assets/css/01-config/mixins.module.scss';

.bingo-item {
    font-size: clamp(14px, 2.4cqmin, 20px);
    font-variation-settings: 'wght' 440;
    padding: 0.5em;
    display: grid;
    place-items: center;
    overflow: hidden;
    background-color: var(--S-40);
    position: relative;
    text-align: center;
    @include mediaTabletLandscape('max') {
    }

    &:after {
        pointer-events: none;
        position: absolute;
        z-index: 0;
        content: '';
        background-color: transparent;
        inset: 0.125rem;
        border-radius: 4px;
    }
}

.complete {
    position: relative;
    color: black;
    background-color: black;
    overflow-wrap: break-word;
    hyphens: auto;

    &>.textFitted {
        z-index: 1;
    }

    &:after {
        background-color: var(--selector-button-color);
        box-shadow: var(--tile-box-shadow-subtle);
    }
}

.player-focused {
    &:after {
        border: 2px solid var(--player-color, var(--S-25));
    }
}
</style>