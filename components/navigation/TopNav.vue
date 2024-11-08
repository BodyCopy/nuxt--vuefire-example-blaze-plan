<template>
    <nav class="top-nav">
        <MissBingoHeader>
            {{ props.pageTitle || 'Miss.BingO' }}
        </MissBingoHeader>
        <div v-if="props.roomCode" class="top-nav-room-code">
            {{ props.roomCode }}
        </div>
        <Transition>
            <BaseButton v-if="!user" to="/login" btn-modifier="micro" btn-style="filled">Sign up</BaseButton>
        </Transition>
    </nav>
</template>
<script setup>
const slots = defineSlots();
const props = defineProps({ layout: String, pageTitle: String, roomCode: String });
import { useUserStore } from '~/stores/userStore';
const route = useRoute();
const { user } = useUserStore();

</script>
<style lang="scss">
.top-nav {
    margin: var(--top-nav-margin-block) 0.5rem; 
    padding: 0.25rem;
    height: var(--top-nav-height, 2rem);
    border-radius: 4px;
    position: sticky;
    top: 0.25rem;
    background-color: transparent;
    // border: 1px solid hsla(262, 47%, 24%, 0.8);
    backdrop-filter: blur(4px);
    z-index: 9;
    display: flex;

    &-room-code {
        &:before {
            content: 'RC: ';
            font-variation-settings: 'wght' 400;
        }

        font-variation-settings: 'wght' 600;
        font-size: 1.25rem;
    }

    &>*:first-child {
        margin-right: auto;
        margin-block: auto;
    }
}
</style>