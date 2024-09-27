<template>
    <li class="bingo-line-item">
        <span v-if="!edit">
            <slot></slot>
        </span>
        <span v-else>
            <BaseInput ref="itemInput" @blur="() => { edit = false }" :mimic-element="true" v-model="bingoItems[index]"
                width="fc"></BaseInput>
        </span>
        <div class="actions">
            <button v-if="!edit" @click="editValue">
                <Icon name="edit-2" size="16" />
            </button>
            <button v-else @click="() => { edit = false }">
                Save
            </button>
            <button @click="$emit('delete')">
                <Icon name="trash" size="16" />
            </button>
        </div>
    </li>
</template>
<script setup>
const props = defineProps({ edit: Boolean, value: String, index: Number });
const lineItemValue = ref(props.value, '');
const edit = ref(false);
const bingoItems = inject('bingoItems');
const itemInput = ref(null);
async function editValue() {
    edit.value = true;
    await nextTick();
    itemInput.value.focusInput();
}
</script>
<style lang="scss">
.bingo-line-item {
    padding: 0.25rem;
    padding-inline-start: 0.5rem;
    min-height: 2.5rem;
    display: flex;
    align-items: center;
    border: 1px solid var(--S-30);
    font-size: 1rem;

    &:has(+ .bingo-line-item) {
        margin-block-end: -1px;
    }

    &:before {
        font-size: 1.25rem;
    }

    &>span {
        display: inline-block;
        margin-right: auto;
        max-width: 40ch;
    }

    &:hover {
        filter: brightness(1.333);

        &>.actions {
            display: flex;
        }
    }

    &>.actions {
        border: 1px solid var(--S-40);
        overflow: hidden;
        border-radius: 0.25rem;
        backdrop-filter: blur(2px);
        position: absolute;
        right: 0.25rem;
        top: 0.25rem;
        bottom: 0.25rem;
        height: calc(100% - (2* 0.25rem));
        display: none;
        transition: all 160ms ease-in;

        &>button {
            font-size: 0.75rem;
            padding: 0.25rem;
            background-color: rgba(39, 13, 126, 0.64);
            display: flex;
            align-items: center;

            &:first-of-type {
                border-inline-end: 1px solid black;
            }
        }


        &>.icon {
            margin: auto;
        }
    }
}
</style>