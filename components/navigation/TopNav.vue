<template>
    <nav class="top-nav">
        <MissBingoHeader />
        <Transition>
            <BaseButton v-if="user" btn-modifier="micro" to="/login">Log in</BaseButton>
            <BaseButton v-else btn-modifier="micro">Sign in</BaseButton>
        </Transition>
    </nav>
</template>
<script setup>
const user = getCurrentUser();
</script>
<style lang="scss">
.top-nav {
    margin: 0.25rem;
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
    &>*:first-child{
        margin-right: auto;
    }
}
</style>