<template>
  <TopNav></TopNav>
  <main class="index-main">
    <div class="miss-bingo-index-actions">
      <div>
        <BaseInput v-model="roomCode" label="Enter room code"></BaseInput>
        <BaseButton :to="joinRoomUrl" width="fc">
          Join room
        </BaseButton>
      </div>
      <NuxtLink to="create-room">
        Create room
      </NuxtLink>
      <NuxtLink v-if="user" :to="`profile/${user}`">
        Profile
      </NuxtLink>
      <NuxtLink v-if="user" :to="`profile/${user}`">
        Template
      </NuxtLink>
    </div>
  </main>
</template>
<script setup>
import { useUserStore } from "~/stores/userStore.js";
definePageMeta({
  linkTitle: 'Home',
  order: 0,
  layout: false
})
const roomCode = ref('');
const joinRoomUrl = computed(() => {
  return `rooms/join/${roomCode.value}`;
})
const { user } = useUserStore();
</script>
<style lang="scss">
main.index-main {
  padding: 0 0.5rem 0.5rem 0.5rem;

}

.miss-bingo-index-actions {
  display: grid;
  grid-template-rows: 1fr max-content;
  grid-template-columns: 1fr 1fr 1fr;
  height: 100%;
  gap: 0.5rem;
  &>*{
    border: 1px solid var(--S-30);
    padding: 0.5rem;
    display: grid;
    place-content: center;
  }
  &>*:first-child {
    grid-column: span 3;
    gap: 0.5rem;
  }
}
</style>
