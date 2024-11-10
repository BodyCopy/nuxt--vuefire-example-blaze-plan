<template>
    <Teleport to="body">
        <TransitionGroup name="snacks" tag="ul" class="snackbar-controller">
            <BaseSnackBar class="snackbar" v-for="(snack, index) in snackbarQue" :key="index" :type="snack.type">{{
                snack.message }}
            </BaseSnackBar>
        </TransitionGroup>
    </Teleport>
</template>
<script setup>
import { useSnackbar } from '~/composables/useSnackbar';
const props = defineProps(['snackbars']);
const { snackbarQue } = useSnackbar();
const test = [
    { type: 'success', message: 'hello testing' },
    { type: 'success', message: 'hello testing' }
]

</script>
<style>
.snackbar-controller {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    place-items: center;
    position: fixed;
    bottom: 4rem;
    z-index: 1000;
    padding: 0 var(--main-padding-sides);
    width: 100%;
}

.snackbar {
    margin-left: 0;
}

.snacks-move {
    /* apply transition to moving elements */
    transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.snacks-enter-from,
.snacks-leave-to {}

.snacks-leave-to {
    transform: translateY(32px);
}

.snacks-enter-from {
    transform: translateY(-32px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.snacks-leave-active {
    opacity: 0;
    position: absolute;
}
</style>