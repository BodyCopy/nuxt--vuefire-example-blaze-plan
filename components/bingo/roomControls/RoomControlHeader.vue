<template>
    <header class="room-control-header">
        <div class="room-control-player-info">
            <SegmentDisplay string="88" />
            <img :src="icons['red']" alt="">
            <p>{{ nickname || 'Anon' }}</p>
        </div>
        <ul class="room-control-menu-items">
            <li>
                <button>
                    <IconTrash />
                </button>
            </li>
            <li>
                <button>
                    <IconTrash />
                </button>
            </li>
            <li>
                <button>
                    <IconTrash />
                </button>
            </li>
        </ul>
    </header>
</template>
<script setup>
import { icons } from '../colors/icons.js';
const props = defineProps({ nickname: String, color: String, score: Number })
</script>
<style lang="scss">
.room-control {
    &-header {
        padding-inline-start: 0.5rem;
        height: var(--room-control-height);
        display: grid;
        grid-template-columns: 1fr max-content;
        align-items: center;
    }

    &-player-info {
        display: grid;
        align-items: center;
        grid-template-columns: max-content max-content 1fr;
    }

    &-menu-items {
        width: 120px;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);

        &>li>button {
            aspect-ratio: 1/1;
            height: 100%;
            padding: 0.5rem;
        }
    }
}

.segment-display {
    height: 78%;
}
</style>