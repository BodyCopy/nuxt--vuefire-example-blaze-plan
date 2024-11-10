<template>
    <div ref="roomControl" class="room-controls">
        <RoomControlHeader @open-panel="openPanel" @close="expandCollapseContent" :expanded :selectedTab :playerDetails>
        </RoomControlHeader>
        <div v-touch:swipe.down="expandCollapseContent" ref="roomControlContent" class="room-controls-content">
            <component :is="controls[selectedTab]" :payload="payload"></component>
        </div>
    </div>
</template>
<script setup>
import RoomControlPlayer from './RoomControlPlayer.vue';
import RoomControlSettings from '../settings/RoomControlSettings.vue';
import RoomControlPlayers from '../players/BingoPlayers.vue';
import RoomControlLog from './roomLog/RoomControlLog.vue';
const props = defineProps({ roomData: Object, scoreBoard: Object, scoreData: Object, bingoCardData: Object, player: Object });
const selectedTab = ref('Player');
const roomControl = ref(null);
const roomControlContent = ref(null);
const expanded = ref(false);
async function openPanel(tab) {
    selectedTab.value = tab;
    await nextTick();
    expandCollapseContent();
}
const playerDetails = computed(() => {
    return {
        nickname: props.player.nickname,
        color: props.player.color,
        score: props.scoreBoard[props.player.color]
    }
})
const payload = computed(() => {
    if (selectedTab.value === 'Settings') {
        return {
            creator: props.roomData?.creator,
            roomType: props.roomData?.roomType,
            seed: props.bingoCardData?.seed,
            game: props.roomData?.game,
            gameMode: props.roomData?.gameMode,
            gameType: props.roomData?.gameType
        };
    }
    if (selectedTab.value === 'Players') {
        return {
            nickname: props.player.nickname,
            players: props.roomData.players,
            score: props.scoreBoard,
        };
    }
    if (selectedTab.value === 'Player') {
        return {};
    }
})
function expandCollapseContent() {

    let elementHeight = roomControlContent.value.clientHeight;
    //if the window is smaller then the header + the content
    if (expanded.value) {
        roomControl.value.style.transform = `translateY(0px)`;
    } else {
        roomControl.value.style.transform = `translateY(-${elementHeight}px)`;
    }
    expanded.value = !expanded.value;
    console.log('clicked');

}
const controls =
{
    Settings: RoomControlSettings,
    Player: RoomControlPlayer,
    Players: RoomControlPlayers,
    Logs: RoomControlLog
}
</script>
<style lang="scss">
.room-controls {
    border-block-start: 1px solid var(--S-30);
    position: fixed;
    top: calc(100dvh - (var(--room-control-header-height)));
    left: 0;
    right: 0;
    bottom: 0;
    height: max-content;
    background-color: var(--background-color);
    z-index: 4;
    transition: transform 240ms ease-in-out;

    &-content {
        padding: 0.5rem;
        padding-block-end: 1rem;
        max-height: calc(90dvh - var(--room-control-header-height));
        overflow-y: auto;
        overscroll-behavior: none;
    }
}
</style>