<template>
    <div class="room-score">
        <div class="color-score" v-for="(obj,key) in score">
            {{ key + ':' + obj }}
        </div>
    </div>
</template>
<script setup>
const props = defineProps({ score: { type: Object } });
</script>
<style lang="sass">

</style>