<template>
    <div class="bingo-card-creator">
        <BingoCardCreatorForm @test-bingo-card="loadTestCard"></BingoCardCreatorForm>
        <!-- <BingoCard v-if="testBingoCardItems" :bingoItems="testBingoCardItems"></BingoCard> -->
        <h2>SEE EXAMPLE</h2>
        <button>See example</button>
        <p>{{ testBingoCardItems }}</p>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import useBingoUtilities from '~/composables/bingoUtilities';
import BingoCardCreatorForm from '~/components/bingo/BingoCardCreatorForm.vue';

definePageMeta({
    title: 'Card Creator',
    linkTitle: 'Bingo card creator',
    order: 1,
    layout: 'room-layout'
})

const testBingoCardItems = ref([]);
function loadTestCard(data) {
    console.log('test', data);
    testBingoCardItems.value = data;
    console.log(testBingoCardItems.value);

}




</script>
<style lang="scss"></style>