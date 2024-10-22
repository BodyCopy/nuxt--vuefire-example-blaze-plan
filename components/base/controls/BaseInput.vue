<template>
    <label :class="[inputStyles]"><span v-if="props.label" class="control-label">{{ props.label }}</span>
        <input ref="inputRef" class="control" @blur="() => { $emit('blur') }" v-model="model" :id="props.name"
            :readonly="props.readOnly" :name="props.name" :type="props.type || 'text'" :maxLength="props.maxLength"
            :placeholder="props.placeholder" :autocomplete="autocomplete" :pattern="props.pattern"
            :required="required">
        <div class="helper-content">
            <span v-if="helperText" class="helper-text">{{ helperText }}</span>
            <span v-if="characterCount" class="character-count">{{ characterCount }}</span>
            <span v-if="!validated && errorText" class="error-text">{{ errorText }}</span>
        </div>
    </label>
</template>
<script setup>
import { ref, computed, useAttrs, onMounted } from 'vue';
import { useControlBoilerplate } from './controlBoilerplate.js';
const props = defineProps({
    pattern: String,
    inputStyle: String,
    placeholder: String,
    readOnly: { type: Boolean, default: false },
    type: String,
    name: String,
    label: String,
    display: { type: String, default: 'ttb' },
    width: {type: String, default: 'fc'},
    helperText: String,
    validated: { type: Boolean, default: true },
    errorText: String,
    characterCount: Number,
    maxLength: Number,
    retro: { type: Boolean, default: false },
    mimicElement: { type: Boolean, default: false }
});
const { inputStyles } = useControlBoilerplate(props);
const emits = defineEmits(['blur']);
const model = defineModel({ type: [String, Number] });
const { autocomplete, required } = useAttrs();
const inputRef = ref(null);
/*
pattern="[A-Za-z\s]+" string
*/
onMounted(() => {
    // if(props.pattern){
    //     inputRef.value.addEventListener('blur',(e)=>{
    //         let element = e.target;
    //         let valid = element.validity.valid;
    //         console.log(valid);
    //     })
    // }
})
const focusInput = () => {
    if (inputRef.value) {
        inputRef.value.focus();
    }
};
defineExpose({ focusInput });
// const inputStyle = computed(() => {
//     return {
//         horizontal: props.display === 'ltr',
//         vertical: props.display === 'ttb',
//         ['fill-content']: props.width === 'fc',
//         error: props.validated === false,
//         condensed: props.inputStyle === 'condensed',
//         'read-only': props.readOnly,
//         retro: props.retro,
//     };
// })
</script>

<style lang="scss" scoped>
@import './control-styles.module.scss';

input[type="text"] {}
input:user-valid{

}
input:user-invalid{
    border: 1px solid purple;
}
input:focus:user-invalid{
    
}
</style>