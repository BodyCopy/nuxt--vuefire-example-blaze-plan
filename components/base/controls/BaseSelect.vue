<template>
    <!-- <label for="aiModel">AI Model Used
        <select style="margin-top:0.5rem" id="aiModel" :class="['form-selectors', aiModel.validated ? '' : 'invalid']"
            @change="checkValidated(aiModel)" v-model.lazy="aiModel.value">
            <option value="default" selected>-select a generator-</option>
            <option v-for="model in aiModels" :value="model">{{ model }}</option>
        </select>
    </label> -->
    <label :class="[inputStyles]">
        <span v-if="props.label" class="control-label">{{ props.label }}</span>
        <select class="control" v-model="model" :id="props.name" :name="props.name">
            <option v-if="defaultValue" value="default" selected>{{ defaultValue }}</option>
            <option v-if="typeof props.options === 'object'" v-for="(value, key, index) in options" :value="value">{{
                key }}</option>
            <option v-else v-for="option in props.options" :value="option">{{ option }}</option>
        </select>
        <span v-if="helperText" class="helper-text">{{ helperText }}</span>
        <span v-if="!validated && errorText" class="error-text">{{ errorText }}</span>
    </label>
</template>
<script setup>
import { isObject } from '@vue/shared';
import { ref, computed } from 'vue';
import { useControlBoilerplate } from './controlBoilerplate.js';
const props = defineProps({
    options: { type: [Object, Array] },
    inputStyle: String,
    defaultValue: String,
    readOnly: { type: Boolean, default: false },
    type: String,
    name: String, label: String,
    display: { type: String, default: 'ttb' },
    width: { type: String, default: 'fc' },
    helperText: String,
    validated: { type: Boolean, default: true },
    errorText: String,
    retro: { type: Boolean, default: false }
});
const { inputStyles } = useControlBoilerplate(props);
const model = defineModel({ type: String });

</script>
<style lang="scss" scoped>
@import './control-styles.module.scss';

label {
    color: initial;
}

select {
    color: initial;
    background-color: var(--background-color);
}

option {
    background-color: var(--background-color);
    color: var(--copy-color);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-family: var(--font-ibm-mono);
}
</style>