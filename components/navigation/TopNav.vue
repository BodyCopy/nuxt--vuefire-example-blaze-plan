<template>
    <nav class="top-nav">
        <MissBingoHeader />
        <Transition>
            <BaseButton v-if="!user" to="/login" btn-modifier="micro" btn-style="filled">Sign up</BaseButton>
        </Transition>
    </nav>
</template>
<script setup>
import { useUserData } from '~/stores/userData';
const { user } = useUserData();
</script>
<style lang="scss">
.top-nav {
    margin: 0.25rem 0.5rem;
    padding: 0.25rem;
    height: var(--top-nav-height, 2rem);
    border-radius: 4px;
    position: sticky;
    top: 0.25rem;
    background-color: hsla(240, 16%, 29%, 0.30);
    border: 1px solid hsla(262, 47%, 24%, 0.8);
    backdrop-filter: blur(4px);
    z-index: 9;
    display: flex;

    &>*:first-child {
        margin-right: auto;
    }
}
</style>