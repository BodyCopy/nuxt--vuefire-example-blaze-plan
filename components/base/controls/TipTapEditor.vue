<template>
    <div class="tiptap-editor vertical label">
        <label class="">
            <span>{{ props.label }}</span>
        </label>
        <div class="tiptap-editor__control-wrapper">
            <menu class="micro-action-bar">
                <BaseIconButton btnModifier="micro" @click="() => { editor.chain().focus().toggleBulletList().run() }"
                    :class="{ 'active': editor?.isActive('bulletList') ?? '' }">bl</BaseIconButton>
                <BaseIconButton btnModifier="micro" @click="() => { editor.chain().focus().toggleBold().run() }"
                    :class="{ 'active': editor?.isActive('bold') ?? '' }">b</BaseIconButton>
                <BaseIconButton btnModifier="micro" @click="() => { editor.chain().focus().toggleItalic().run() }"
                    :class="{ 'active': editor?.isActive('italic') ?? '' }">i</BaseIconButton>
                <BaseIconButton btnModifier="micro" @click="setLink" :class="{ 'active': editor?.isActive('link') ?? '' }">A
                </BaseIconButton>
            </menu>
            <editor-content :editor="editor" />
        </div>
    </div>
</template>
  
<script setup>
import { ref, watch, watchEffect, onMounted, onUnmounted, onBeforeUnmount, onUpdated } from 'vue';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { Markdown } from 'tiptap-markdown';
const model = defineModel({ type: String, default: '' });
const props = defineProps({ label: String });
const editor = ref(null);
watchEffect(() => (model, (pVal, nVal) => {
    const isSame = editor.value.getHTML() === nVal;
    // JSON
    // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(nVal)
    if (isSame) {
        return
    }
    editor.value.commands.setContent(nVal, false)
}));
function setLink() {
    const previousUrl = editor.value.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
        return;
    }

    // empty
    if (url === '') {
        editor.value
            .chain()
            .focus()
            .extendMarkRange('link')
            .unsetLink()
            .run();

        return;
    }

    // update link
    editor.value
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: '_blank' })
        .run();
}
// watch(() => (model, (pVal, nVal) => {
//     // HTML
// }))

onMounted(() => {
    editor.value = new Editor({
        editorProps: {
            attributes: {
                class: 'control',
            },
        },
        extensions: [
            StarterKit,
            Markdown,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    target: '_blank',
                },
            }),
        ],
        content: props.modelValue,
        onUpdate: () => {
            // HTML
            model.value = editor.value.getHTML();
            // JSON
            // this.$emit('update:modelValue', this.editor.getJSON())
        },
    })
})

onBeforeUnmount(() => {
    editor.value.destroy();
})
</script>
<style lang="scss">
@import '@/components/base/controls/control-styles.module.scss';

.micro-action-bar {
    display: flex;
    gap: 0.8px;
    background-color: var(--grid-line-color);

    &>.icon-button.micro {
        background-color: var(--background-color);
        border-radius: 0;

        &.active {
            font-weight: 600;
            color: var(--background-color);
            background-color: var(--primary-color-base);
        }
    }
}

.tiptap-editor {
    width: 100%;

    &__control-wrapper {
        overflow: hidden;
        border: 1px solid var(--input-border-color);
        border-radius: 4px;
    }

    & .control {
        border-block-start: 1px solid var(--background-color);
        cursor: text;
        background-color: var(--input-background-color);
        padding: var(--input-padding);
        font-size: 0.825rem;
        color: var(--copy-color);
        font-family: inherit;

        /* @include mediaPhone('max') {
            font-size: 16px;
        } */
    }
}

.tiptap {
    padding: 0rem;

    &>* {
        font-size: 0.825rem;
    }

    h3 {
        margin: 1rem 0 0.5rem;
    }

    >*+* {
        margin-top: 0.75em;
    }

    code {
        background-color: rgba(#616161, 0.1);
        color: #616161;
    }

    & ul {
        list-style: disc;

        &>li {
            --list-offset: 1rem;
        }
    }
}
</style>