<template>
  <main>
    <h2>Welcome!</h2>

    <p>Click on one of the pages above to check the corresponding demo.</p>

    <p>
      Check out
      <a href="https://vuefire.vuejs.org" target="_blank">VueFire docs</a> to
      learn more
    </p>
    <div class="miss-bingo-index-actions">
      <div>
        <h1>JOIN ROOM</h1>
        <BaseInput v-model="roomCode" label="Room Code"></BaseInput>
        <NuxtLink :to="joinRoomUrl">
          Enter
        </NuxtLink>
      </div>
      <NuxtLink to="create-room">
        Create room
      </NuxtLink>
      <NuxtLink v-if="user" :to="`profile/${user}`">
        Profile
      </NuxtLink>
    </div>
  </main>
</template>
<script setup>
import { useUserData } from "~/stores/userData";
definePageMeta({
  linkTitle: 'Home',
  order: 0,
})
const roomCode = ref('');
const joinRoomUrl = computed(() => {
  return `rooms/join/${roomCode.value}`;
})
const { user } = useUserData();
</script>
<style lang="scss">
.miss-bingo-index-actions {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  background-color: violet;
  height: 100%;
  & > *:first-child {
    grid-column: span 2;
  }
}
</style>
