import { reactive } from 'vue';

export const tooltipState = reactive({
    content: '',
    position: { top: 0, left: 0 },
    visible: false,
});
