<template>
    <div :class="['chip-input', { retro: props.retro }]">
        <!-- @blur="() => { typing = false }" -->
        <BaseInput ref="chipInputField" v-model="chipName" tab-index="0" @keydown.enter.prevent="addToChipList"
            @blur="closeMenu" :display="props.display" :width="props.width" :name="props.name" :label="props.label"
            :readOnly="props.readOnly" placeholder="Type and press enter" :helperText="props.helperText">
        </BaseInput>
        <BaseMenu v-if="props.suggestionList && typing" tab-index="1" class="type-ahead" :menuItems="props.suggestionList"
            @menu-item-event="() => { chipName = ''; chipInputField.focusInput(); }">
        </BaseMenu>
        <!-- <span  class="type-ahead">{{ props.suggestion }}</span> -->
        <BaseChipWrapper v-if="chipList.length > 0 || props.modelValue.length > 0">
            <li v-if="chipList.length > 0 && !props.readOnly">
                <BaseButton @click="clearChips" btnStyle="outline" btnModifier="micro">
                    <span v-if="props.max">{{ chipList.length + '/' + props.max }}</span>
                    Clear all
                </BaseButton>
            </li>
            <li v-for="( chips, i ) of  props.modelValue " :key="i">
                <BaseChip @delete-chip="deleteChipFromList" :index="i" size="med" type="hash"
                    :deletable="props.readOnly ? false : true">{{ chips }}
                </BaseChip>
            </li>
        </BaseChipWrapper>
    </div>
</template>
<script setup>
import { ref, onMounted, watch, watchEffect, nextTick } from 'vue'
const props = defineProps({
    modelValue: {
        type: Array,
        default: []
    },
    display: String,
    width: String,
    name: String,
    label: String,
    dimensions: Object,
    readOnly: Boolean,
    suggestionList: Array,
    suggestion: String,
    retro: Boolean,
    helperText: String,
    max: Number,
    characterCount: Number,
});
const emits = defineEmits(['update:modelValue', 'chip-name']);
function deleteChipFromList(index) {
    chipList.value.splice(index, 1);
}
function clearChips() {
    chipList.value = [];
}
const chipInputField = ref(null);
const typing = ref(false);
const chipName = ref('');
const chipList = ref(props.modelValue);
function addToChipList() {
    if (props.max && chipList.value.length >= props.max) {
        alert('maxed');
    } else {

        if (chipName.value !== '') {
            if (!chipList.value.find(e => e === chipName.value)) {
                chipList.value.unshift(chipName.value);
            }
            chipName.value = '';
        } else {
            alert('cannot be empty string');
        }
    }
}
const closeMenu = async () => {
    setTimeout(() => {
        const isFocusedOnMenuItem = document.activeElement && document.activeElement.closest('.type-ahead');
        if (!isFocusedOnMenuItem) {
            typing.value = false;
        }
    }, 0);
}
watchEffect(() => {
    emits('update:modelValue', chipList.value);
})
watchEffect((onInvalidate) => {
    if (chipName.value !== '') {
        typing.value = true;
        const isTyping = setTimeout(async () => {
            await closeMenu();
        }, 3000);
        onInvalidate(() => {
            clearInterval(isTyping);
        });
        chipName.value = chipName.value.toLowerCase();
    } else {
        ;
        typing.value = false;
    }
    emits('chip-name', chipName.value);
})

</script>
<style lang="scss">
.chip-input {
    position: relative;
    border-radius: 4px;

    &>.chip-wrapper {
        padding-block-start: 0.5rem;
    }

    &>.control {}

    &.retro {

        &>.chip-wrapper {
            align-items: center;
            border-block-start: 1px dashed var(--S-30);
            margin-block-start: 0.5rem;
            padding-block-start: 0.5rem;
        }

        &>label {
            font-size: 0.875rem;
            font-weight: 400;
            line-height: 150%;
            letter-spacing: 0.16px;
            color: var(--S-20, #7D7D7D);
            font-family: var(--font-ibm-mono);
        }
    }

    .small-button {
        padding: 0.125rem 0.5rem !important;
        // padding: calc(0.25rem + 1px) 0.25rem !important;
    }

    .type-ahead {
        z-index: 11;
        color: var(--copy-color-muted);
        position: absolute;
        top: calc(2rem + 0.5rem);
        left: 0;
        width: 100%;
    }
}
</style>