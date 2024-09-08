import { computed } from 'vue';
export const useControlBoilerplate = ((props) => {

    const inputStyles = computed(() => {
        return {
            horizontal: props.display === 'ltr',
            vertical: props.display === 'ttb',
            ['fill-content']: props.width === 'fc',
            error: props.validated === false,
            condensed: props.inputStyle === 'condensed',
            retro: props.retro,
            mimic: props.mimicElement,
        };
    })
    return { inputStyles };
})