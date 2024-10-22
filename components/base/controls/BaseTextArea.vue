<template>
    <label :class="[inputStyles]" :for="props.name">
        <span v-if="props.label" class="control-label">{{ props.label }}</span>
        <textarea ref="textArea" :placeholder="props.placeholder" class="control" @input="emitInput" :id="props.name"
            :name="props.name" :value="props.modelValue" :maxlength="props.maxLength" :rows="props.rows || 5"
            :cols="props.cols || 33" :readonly="props.readOnly">
                        </textarea>
        <div class="helper-content">
            <span v-if="helperText" class="helper-text">{{ helperText }}</span>
            <span v-if="characterCount > -1" class="character-count">
                {{ characterCount }}
                <span v-if="maxLength">
                    /{{ maxLength }}
                </span>
            </span>
            <span v-if="!validated && errorText" class="error-text">{{ errorText }}</span>
        </div>
    </label>
</template>
<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useControlBoilerplate } from './controlBoilerplate';
const props = defineProps(
    {
        inputStyle: String,
        placeholder: { type: String, default: '---' },
        readOnly: { type: Boolean, default: false },
        name: String,
        label: String,
        display: { type: String, default: 'ttb' },
        width: String,
        helperText: String,
        validated: { type: Boolean, default: true },
        errorText: String,
        maxLength: [Number, String],
        characterCount: Number,
        rows: Number, cols: Number,
        retro: { type: Boolean, default: false },
        mimicElement: { type: Boolean, default: false }
    }
);
const { inputStyles } = useControlBoilerplate(props);
const model = defineModel({ type: String });
const textArea = ref(null);
function emitInput(e) {
    e.target.style.height = 'auto'; // Reset height to auto to get the correct scrollHeight
    e.target.style.height = (e.target.scrollHeight) + 'px'; // Set the height to the scrollHeight
    model.value = e.target.value;
}
onMounted(() => {
    if (!props.rows) {
        textArea.value.style.height = ((textArea.value.scrollHeight) + 3) + 'px';
        console.log(textArea.value.scrollHeight);
    }
})

</script>
<style lang="scss" scoped>
@import './control-styles.module.scss';
</style>