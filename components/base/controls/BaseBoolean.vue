<template>
    <div :class="'boolean'">
        <label :class="[booleanStyle, 'boolean-label', 'checkbox-container']" :for="id || label" :aria-label="label">
            <input :class="['hidden-checkbox']" ref="hiddenCheckbox" role="checkbox" :aria-checked="model" type="checkbox"
                :id="id ?? label" :checked="model" @change="updateValue" />
            <svg class="checkbox" viewBox="0 0 24 24" aria-hidden="true" stroke-width="1px" stroke="var(--temp-freeze)">
                <rect class="checkbox-box" rx="0px" x="2" y="2" width="20" height="20" stroke-linejoin="round" />
                <path class="checkbox-check" d="M6,12 L10,16 L18,8"></path>
            </svg>
            <span v-if="!hideLabel">{{ name || label }}</span>
        </label>
    </div>
</template>
  
<script setup>
import { computed, onMounted, ref } from 'vue';
const props = defineProps({ booleanStyle: String, size: { type: String, default: 'lg' }, readOnly: { type: Boolean, default: false }, name: String, label: String, id: String, display: String, width: String, helperText: String, hideLabel: { type: Boolean, default: false }, retro: { type: Boolean, default: false } });
const model = defineModel({ type: Boolean });
const hiddenCheckbox = ref(null);
const updateValue = event => {
    hiddenCheckbox.value.setAttribute('aria-checked', event.target.checked);
    model.value = event.target.checked;
    // emits('update:modelValue', event.target.checked);
};

const booleanStyle = computed(() => {
    return {
        button: props.booleanStyle,
        horizontal: props.display === 'ltr',
        vertical: props.display === 'ttb',
        sm: props.size === 'sm',
        md: props.size === 'md',
        lg: props.size === 'lg',
        ['fill-content']: props.width === 'fc',
        error: props.validated === false,
        condensed: props.inputStyle === 'condensed',
        'read-only': props.readOnly,
        retro: props.retro,
    };
})
onMounted(() => {
    hiddenCheckbox.value.setAttribute('aria-checked', props.modelValue);
})
//fix this later.
//need to moduleize the btton styles and reuse it here
</script>
<style scoped lang="scss">
@import '@/components/base/controls/control-styles.module.scss';

.hide {
    display: hidden;
}

[type="checkbox"] {
    cursor: inherit;
    width: 1.25rem;
    height: 1.25rem;
    margin: 0;
    display: block;
}

.button {
    width: max-content;
    height: max-content;
    padding: 0.5rem 0.5rem;
    background-color: var(--background-color);
}

.button:hover {
    filter: brightness(var(--hover-brightness));
}

.boolean-label {
    cursor: pointer;
    padding: 0.25rem;
    gap: 0.5rem;
    display: block;
    transition: background-color var(--default-fade);

    &>span {
        margin: auto;
    }
}

.hidden-checkbox {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
    border: none;
}

.checkbox-container {
    &.sm {
        --checkbox-size: 1rem;
    }

    &.md {
        --checkbox-size: 1.25rem;
    }

    &.lg {
        --checkbox-size: 1.75rem;
    }

    cursor: pointer;
    display: flex;

    &.horizontal {
        gap: 0.25rem;
        flex-direction: row-reverse;
    }
}

.checkbox {
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    display: block;
    fill: none;

}

.checkbox-container {
    &:focus-within {
        .checkbox-box {
            stroke: var(--focus-border-color);
            stroke-width: 0.8px;
        }
    }
}

.checkbox-box {
    stroke: var(--S-35);
    stroke-width: 0.8px;
    fill: var(--background-color);
    // stroke-dasharray: 1px 1px;
    overflow: visible;
}


.checkbox-check {
    stroke-linecap: round;
    stroke-width: 2px;
    /* This value is configurable for the check width */
    stroke-dasharray: 24;
    /* This might need adjustment based on the length of your check path */
    stroke-dashoffset: 24;
    transition: stroke-dashoffset 0.64s;
}

.hidden-checkbox:checked+.checkbox {
    & .checkbox-check {
        stroke-dashoffset: 0;
        stroke-width: 2px;
        stroke: var(--background-color);
    }

    & .checkbox-box {
        fill: var(--copy-color-muted);
        stroke: var(--background-color);
    }
}
</style>
  