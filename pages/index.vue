<template>
  <TopNav></TopNav>
  <main class="index-main">
    <div class="miss-bingo-index-actions">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.75" y="0.75" width="16.5" height="16.5" stroke="#454545" stroke-width="0.5" />
        <rect x="1" y="1" width="2.66667" height="2.66667" fill="black" />
        <rect x="1" y="4.33325" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect x="1" y="7.66675" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect x="1" y="11" width="2.66667" height="2.66667" fill="black" />
        <rect x="1" y="14.3333" width="2.66667" height="2.66667" fill="black" />
        <rect x="14.3333" y="1" width="2.66667" height="2.66667" fill="black" />
        <rect x="4.33334" y="1" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect x="4.33334" y="4.33325" width="2.66667" height="2.66667" fill="black" />
        <rect x="4.33334" y="7.66675" width="2.66667" height="2.66667" fill="red" />
        <rect x="4.33334" y="11" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect x="4.33334" y="14.3333" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect x="7.66666" y="1" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect x="7.66666" y="4.33325" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect id="nose" x="7.66666" y="7.66675" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect x="7.66666" y="11" width="2.66667" height="2.66667" fill="black" />
        <rect x="7.66666" y="14.3333" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect x="14.3333" y="7.66675" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect x="11" y="1" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect x="11" y="4.33325" width="2.66667" height="2.66667" fill="black" />
        <rect x="11" y="7.66675" width="2.66667" height="2.66667" fill="red" />
        <rect x="11" y="11" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect x="11" y="14.3333" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect x="14.3333" y="4.33325" width="2.66667" height="2.66667" fill="#CD9BEC" />
        <rect x="14.3333" y="11" width="2.66667" height="2.66667" fill="black" />
        <rect x="14.3333" y="14.3333" width="2.66667" height="2.66667" fill="black" />
      </svg>
      <div class="join-room calculator-screen">
        <label class="room-code" for="room-code">
          <span class="control-label calculator-screen-item">ENTER ROOM CODE</span>
          <div class="room-code-input-wrapper calculator-screen-item">
            <input v-model="roomCode" class="room-code-input" placeholder="A1A1" type="text" name="room-code"
              maxlength="4" />
          </div>
        </label>
        <NuxtLink class="join-room-button calculator-screen-item" :to="joinRoomUrl">
          >>JOIN ROOM<< </NuxtLink>
      </div>
      <NuxtLink to="create-room">
        Create room
      </NuxtLink>
      <NuxtLink v-if="user" :to="`profile/`">
        Profile
      </NuxtLink>
      <NuxtLink v-if="user" :to="`profile/`">
        Template
      </NuxtLink>
    </div>
  </main>
</template>
<script setup>
import MissBingoLogo from '~/public/MissBingoLogo.svg';
import { useUserStore } from "~/stores/userStore.js";
definePageMeta({
  linkTitle: 'Home',
  order: 0,
  layout: false
})
const roomCode = ref('');
const joinRoomUrl = computed(() => {
  return user.value ? `rooms/join/${roomCode.value}` : '';
})
const { user } = useUserStore();
</script>
<style lang="scss">
.room-code {
  display: grid;
  width: 100%;
  gap: 1px;
  &-input {
    all: unset;
    background-color: black;
  }
}

main.index-main {
  padding: 0 0.5rem 0.5rem 0.5rem;

}

.miss-bingo-index-actions {
  display: grid;
  grid-template-rows: 0.5fr 1fr max-content;
  grid-template-columns: 1fr 1fr 1fr;
  height: 100%;
  gap: 0.5rem;

  &>*:first-child {
    grid-column: span 3;
    width: 100%;
    gap: 0.5rem;
  }
}

.join-room {
  grid-column: span 3;
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 1px;

  &>* {
    padding: 0.5rem;
  }

  &-button {
    margin: 0.5rem;
    border-radius: 0.5rem;
    display: grid;
    place-items: center;
    font-size: 3rem;
  }
}

.room-code {
  display: grid;
  width: 100%;
  grid-template-rows: max-content 1fr;

  &>.control-label {
    display: block;
    font-size: 2rem;
  }

  &-input-wrapper {}

  &-input {
    all: unset;
    cursor: text;
    border-block: 1px solid black;
    font-size: 4rem;
    width: 100%;
    height: 100%;
    margin-inline: auto;
    text-align: center;
  }
}
</style>
