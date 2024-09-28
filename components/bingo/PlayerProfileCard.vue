<template>
    <div class="player-profile-card">
        <ColorSelectorButton :color="color" :flat="true"></ColorSelectorButton>
        <h4>{{nickname}}</h4>
    </div>
</template>
<script setup>
const props = defineProps({ nickname: { type: String, default: 'Anon' }, color: { type: String, default: 'red' } })
</script>
<style lang="scss">
.player-profile-card{
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 0.5rem;
    align-items: center;
}
</style>