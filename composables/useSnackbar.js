
const snackbarQue = ref([]);
export function useSnackbar() {

    // const snackbarQue = ref([]);

    function createSnackbar({ type, message, state }) {
        snackbarQue.value.push({ type, message, state })
        setTimeout(() => { snackbarQue.value.shift() }, 3000);
        console.log(snackbarQue.value, type, message);
    }

    return { snackbarQue, createSnackbar };
};