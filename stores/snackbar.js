import { ref } from 'vue';

export const snackbarQue = ref([]);
export function createSnackbar({ type, message, state }) {
    snackbarQue.value.push({ type, message, state })
    setTimeout(() => { snackbarQue.value.shift() }, 3000);
    console.log(snackbarQue.value,type,message);
}