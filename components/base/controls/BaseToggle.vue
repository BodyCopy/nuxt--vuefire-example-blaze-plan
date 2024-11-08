<template>
    <div :class="['label', 'control', 'retro', toggleStyle]">
        <span v-if="props.label">{{ props.label }}</span>
        <!-- <span v-if="statusText">{{ props.modelValue ? 'Yes' : 'No' }}</span> -->
        <label :class="['toggle-switch']">
            <input type="checkbox" @input="(e) => { $emit('update:modelValue', e.target.checked) }" :id="props.name"
                :name="props.name" :checked="props.modelValue" />
            <span class="slider round"></span>
        </label>
        <div class="helper-content">
            <span v-if="helperText" class="helper-text">{{ helperText }}</span>
            <span v-if="!validated && errorText" class="error-text">{{ errorText }}</span>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    readOnly: Boolean,
    name: String,
    label: String,
    modelValue: Boolean,
    display: { type: String, default: 'ttb' },
    helperText: String,
    validated: Boolean,
    errorText: String,
    statusText: Boolean,
    width: { type: String, default: 'fc' },
})
const emits = defineEmits(['update:modelValue']);
const toggleStyle = computed(() => {
    return {
        horizontal: props.display === 'ltr',
        vertical: props.display === 'ttb',
        ['fill-content']: props.width === 'fc',
        error: props.validated === false,
        'read-only': props.readOnly,
    };
})
</script>
<style scoped lang="scss">
//view assets/css/02-base/controls for full style sheet

.label.control.fill-content {
    width: 100%;
}

.label.control>span {
    margin-block-end: 0.25rem;
}

/* The switch - the box around the slider */
.toggle-switch {
    position: relative;
    display: inline-block;
    width: 3rem;
    height: 1.5rem;
}

/* Hide default HTML checkbox */
.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

/* The slider */
.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--grey-80);
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

.slider:before {
    position: absolute;
    content: '';
    height: 1.25rem;
    width: 1.25rem;
    left: 0px;
    bottom: 0px;
    background-color: var(--copy-color);
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

input:checked+.slider {
    background-color: var(--primary-color-base);
    border-color: var(--primary-color-base);
}

input:focus+.slider {
    box-shadow: 0 0 1px var(--current-color);
}

input:checked+.slider:before {
    transform: translateX(1.5rem);
}

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
    border: 2px solid var(--grey-80);
}

.slider.round:before {

    border-radius: 50%;
}
</style>