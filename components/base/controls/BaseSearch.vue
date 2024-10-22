<template>
    <label :class="[inputStyle, 'base-search']"><span v-if="props.label" class="control-label">{{ props.label }}</span>
        <!-- <IconSearch class="search-icon" /> -->
        <input ref="inputRef" class="control" @blur="() => { $emit('blur') }"
            @input="(e) => { $emit('update:modelValue', e.target.value) }"
            @keydown.enter.prevent="(e) => { $emit('search') }" :id="props.name" :name="props.name" type="search"
            :value="props.modelValue" :max-length="props.maxLength" :placeholder="props.placeholder"
            :autocomplete="autocomplete">
        <div class="helper-content">
            <span v-if="helperText" class="helper-text">{{ helperText }}</span>
            <span v-if="!validated && errorText" class="error-text">{{ errorText }}</span>
        </div>
    </label>
</template>
<script setup>
import { ref, computed, useAttrs } from 'vue';
import IconSearch from '@/components/icons/IconSearch.vue';
const props = defineProps({ inputStyle: String, placeholder: String, name: String, label: String, modelValue: [String, Number], display: String, width: String, helperText: String, validated: { type: Boolean, default: true }, errorText: String, maxLength: Number, retro: { type: Boolean, default: false } });
const emits = defineEmits(['update:modelValue', 'blur', 'search']);
const { autocomplete } = useAttrs();
const inputRef = ref(null);
const focusInput = () => {
    if (inputRef.value) {
        inputRef.value.focus();
    }
};
defineExpose({ focusInput });
const inputStyle = computed(() => {
    return {
        horizontal: props.display === 'ltr',
        vertical: props.display === 'ttb',
        ['fill-content']: props.width === 'fc',
        error: props.validated === false,
        condensed: props.inputStyle === 'condensed',
        'read-only': props.readOnly,
        retro: props.retro,
    };
})
</script>

<style lang="scss" scoped>
@import './control-styles.module.scss';

input[type="search"] {
    padding-inline-start: 1.75rem;
}

.base-search {
    position: relative;
    height: max-content;
}

.search-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
}
</style>