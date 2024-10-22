<template>
    <header class="room-control-header">
        <div v-if="!expanded" class="room-control-header-collapsed">
            <div @click="openPanel('Player')" class="room-control-player-info">
                <SegmentDisplay :string="playerScore" :displayBoard="true" />
                <ColorSelectorButton :flat="true" :color="playerDetails.color" />
                <p class="room-control-header-player-nickname" :title="playerDetails.nickname || 'Anon'">{{
                    playerDetails.nickname || 'Anon' }}</p>
            </div>
            <ul class="room-control-menu-items">
                <li>
                    <button @click="openPanel('Settings')">
                        <IconSettings />
                    </button>
                </li>
                <li>
                    <button @click="openPanel('Players')">
                        <IconUsers />
                    </button>
                </li>
                <li>
                    <button @click="openPanel('Logs')">
                        <IconMessageCircle />
                    </button>
                </li>
            </ul>
        </div>
        <div v-else class="room-control-header-expanded">
            <component :is="roomIcons[selectedTab] || roomIcons['Settings']"></component>
            <h4 class="room-control-header-expanded-heading">{{ selectedTab }}</h4>
            <BaseIconButton>
                <IconX @click="() => { $emit('close') }" />
            </BaseIconButton>
        </div>
    </header>
</template>
<script setup>
import IconSettings from '~/components/icons/IconSettings.vue';
import IconMessageCircle from '~/components/icons/IconMessageCircle.vue';
import IconUsers from '~/components/icons/IconUsers.vue';
const props = defineProps({ playerDetails: Object, expanded: Boolean, selectedTab: String });
const emits = defineEmits(['open-panel', 'close'])
function openPanel(data) {
    emits('open-panel', data);
}
const roomIcons = {
    Settings: IconSettings,
    Players: IconUsers,
    Logs: IconMessageCircle
}
const playerScore = computed(() => {
    if (props.playerDetails?.score) {
        return props.playerDetails.score.toString().padStart(2, '0');
    } else {
        return '00'
    }
})
</script>
<style lang="scss">
.room-control {
    &-header {
        padding-inline: 0.5rem;
        height: var(--room-control-header-height);

        &-collapsed,
        &-expanded {
            height: inherit;
            display: grid;
            gap: 0.5rem;
            grid-template-columns: 1fr max-content;
            align-items: center;
        }

        &-player-nickname {
            margin-top: 0.125rem;
            font-size: 1.5rem;
            text-overflow: ellipsis;
            overflow-x: hidden;
            text-wrap: nowrap;
        }

        &-expanded {
            grid-template-columns: 24px 1fr max-content;

            &-heading {
                margin-block-start: 0.125rem;
            }
        }

        &-collapsed {}
    }

    &-player-info {
        display: grid;
        align-items: center;
        grid-template-columns: max-content max-content 1fr;
        height: inherit;
        gap: 0.5rem;
        align-items: center;
        --segment-display-height: calc(var(--room-control-header-height) - 1rem);

        &>.color-selector-button {
            height: calc(var(--room-control-header-height) - 1rem);
        }
    }

    &-menu-items {
        width: 96px;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);

        &>li>button {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            &>svg {
                height: 24px;
                aspect-ratio: 1/1;
            }
        }
    }
}
</style>