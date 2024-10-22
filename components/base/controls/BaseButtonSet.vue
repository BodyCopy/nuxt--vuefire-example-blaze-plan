<template>
    <div :class="[inputStyle, 'condensed', 'bp-input','label','base-button-set']">
        <label v-if="props.label">{{ props.label }}</label>
        <div class="button-wrapper control">
            <button v-for="(option, key, index) in processedItems " :key="option.value"
                @click.prevent="selected(option.value)"
                :class="[model === option.value ? 'active' : '', 'bp-button', 'outline', 'condensed']">{{
                    option.label }}</button>
        </div>
        <span v-if="helperText" class="helper-text">{{ helperText }}</span>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
    options: Object,
    label: String,
    width: String,
    display: { type: String, default: 'ttb' },
    readOnly: { type: Boolean, default: false },
    boolean: { type: Boolean, default: false },
    wrap: { type: Boolean, default: false },
    helperText: { type: String },
    retro: { type: Boolean, default: false }
});
const inputStyle = computed(() => {
    return {
        horizontal: props.display === 'ltr',
        vertical: props.display === 'ttb',
        ['fill-content']: props.width === 'fc',
        // error: props.validated === false,
        // condensed: props.inputStyle === 'condensed',
        'read-only': props.readOnly,
        retro: props.retro,
        wrap: props.wrap,
    };
})
const model = defineModel({ type: [String, Number, Boolean], default: null })
const processedItems = computed(() => {
    if (Array.isArray(props.options)) {
        // If items is an array, map it to an object format
        return props.options.map(item => ({ value: item, label: item }));
    } else {
        // If items is an object, convert it to an array with value and label
        return Object.entries(props.options).map(([label, value]) => ({ label, value }));
    }
}
)
function selected(option) {
    let value = option
    if (value === model.value) {
        model.value = null;
    } else {
        model.value = value;
    }
}
// const buttonSetStyles = computed(() => {
//     return {
//         firstOption:
//     }
// })
</script>
<style lang="scss" scoped>
@import '~/components/base/buttons/button-styles.module.scss';
@import './control-styles.module.scss';

.button-wrapper.control {
    display: flex;
    flex-wrap: nowrap;
    width: max-content;
    border: 1px dotted var(--S-25);
    border-radius: 0.5rem;
    overflow: hidden
}

.fill-content {
    &>.button-wrapper {
        width: 100%;

        &>.bp-button {
            flex: 1 1 0;
        }
    }
}

.wrap {
    &>.button-wrapper {
        flex-wrap: wrap;
        width: 100%;

        &>button {
            flex-grow: 1;
        }
    }
}

.retro {
    background-color: var(--background-color);
    padding: 0.125rem 0.5rem;
    gap: 0rem;

    &>label {}

    &>.control {
        width: 100%;
        display: flex;

        &>.bp-button {
            // flex: 1 1 auto;
        }
    }
}

.bp-button {
    text-align: center;
    font-size: 0.825rem;
    background-color: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;

    &:focus:not(.active) {
        outline: 2px solid var(--focus-border-color);
        outline-offset: -2px;
        border-radius: 4px;
    }

    &.active {
        background-color: var(--background-color);
        color: var(--S-05);
        // color: var(--primary-base-color);
        border: var(--line-break);
        border-radius: 0.375rem;
        text-decoration: underline;
        margin-block: -1px;

        &:first-of-type {
            border-inline-start: none;
        }

        &:last-of-type {
            border-inline-end: none;
        }
    }
}
</style>