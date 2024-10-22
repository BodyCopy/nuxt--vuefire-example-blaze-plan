<template>
    <main class="room-form">
        <form>
            <RoomFormCreateSnippet></RoomFormCreateSnippet>
            <RoomFormJoinSnippet></RoomFormJoinSnippet>
            <fieldset>
                <legend>Room data</legend>
                <BaseInput v-model="roomName" label="Room name" width="fc"></BaseInput>
                <BaseTextArea v-model="randomSeed" label="Seed" width="fc"></BaseTextArea>
                <BaseInput v-model="game" label="Game" width="fc"></BaseInput>
                <BaseSelect v-model="gameMode" label="Game mode" width="fc"
                    :options="{ ['Lock out']: 'lock-out', Standard: 'standard' }"></BaseSelect>
            </fieldset>
            <BaseInput v-model="displayName" label="Display name" width="fc"></BaseInput>
            <BaseInput v-model="password" label="Password" width="fc"></BaseInput>
            <div>COLOR SELECTION</div>
        </form>
    </main>
    <!--
              <BaseSelect v-model="template" default-value="--or use a template--" label="Template" width="fc"
                    :options="['yellow', 'red']">
                </BaseSelect>
    -->
</template>
<script lang="ts">
import { collection, doc, getDoc, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from 'vuefire';
import { useRooms } from '~/composables/roomUtilities';
import {generateRandomSeed, getRandomItemsWithSeed} from '~/composables/bingoUtilities';
import RoomFormCreateSnippet from './RoomFormCreateSnippet.vue';
import { RoomFormJoinSnippet } from '#build/components';
// import { v4 as uuidv4 } from 'uuid';

const roomName = ref('');
const password = ref('');
const displayName = ref('');
const game = ref('');
const gameMode = ref('');
const randomSeed = ref(generateRandomSeed());
</script>
<style lang="scss"></style>