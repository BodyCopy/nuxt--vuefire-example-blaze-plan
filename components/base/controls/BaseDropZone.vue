<template>
    <div v-if="touch || !dropzone" class="dropzone-touch dot-grid-paper">
        <label class="dropzone-label bp-button outline" for="dropzoneFile">
            <slot>Upload file</slot>
        </label>
        <input class="dropzone-input" @change="uploadedImages" type="file" id="dropzoneFile" name="dropzoneFile"
            accept="image/png, image/jpeg, image/webp" />
    </div>
    <div v-else :class="['dropzone', 'dot-grid-paper', dropZoneActive ? 'active' : '']"
        @dragenter.prevent="toggleActive" @dragleave.prevent="toggleActive" @dragover.prevent
        @drop.prevent="uploadedImages" class="dropzone">
        <p>Drag and Drop or</p>
        <label class="dropzone-label bp-button outline" for="dropzoneFile">
            <slot>Upload Files</slot>
        </label>
        <input class="dropzone-input" @change="uploadedImages" type="file" multiple id="dropzoneFile"
            name="dropzoneFile" accept="json, csv, txt" />
        <p class="rules retro small" v-if="slots.rules">
            <slot name="rules"></slot>
        </p>
    </div>
</template>
<script setup>
const props = defineProps({
    uploadLimit: Number,
    fileSizeLimit: Number,
    dropzone: { type: Boolean, default: true }
});
const touch = inject('touch');
const dropZoneActive = ref(false);
const emits = defineEmits(['uploaded-images']);
const slots = useSlots();
function uploadedImages(e) {
    toggleActive();
    let files;
    if (e.target.files) {
        files = [...e.target.files]
    } else {
        files = [...e.dataTransfer.files];
    }
    console.log(files);
    let cancelUpload = false; // Flag to determine whether to cancel the entire upload process

    if (files.length > props.uploadLimit) {
        alert(`You may only upload ${props.uploadLimit} files at a time`);
        return; // Stops execution if too many files
    }

    for (let index = 0; index < files.length; index++) {
        const f = files[index];
        files[index].url = URL.createObjectURL(f);
        console.log(f);
        if (f.size > props.fileSizeLimit) {
            const userResponse = confirm(`${f.name} is over ${props.fileSizeLimit} please resize. Would you like to continue without ${f.name}?`);
            if (userResponse) {
                files.splice(index, 1);
                index--; // Adjust the index due to the spliced element
            } else {
                console.log('cancelling uploads');
                cancelUpload = true;
                break; // Exit the loop
            }
        }
    }

    if (!cancelUpload) {
        emits('uploaded-images', files);
    }
}

function toggleActive() {
    dropZoneActive.value = !dropZoneActive.value;
}
</script>
<style scoped lang="scss">
.dropzone {
    border: 1px dashed var(--B-45, #1C3042);
    display: flex;
    gap: 1rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: var(--input-border-radius);

    &-touch {
        border: 1px dashed var(--B-45, #1C3042);
        height: max-content;
        padding: 1rem;
        width: 100%;

        &>label {
            text-align: center;
            width: 100%;
        }
    }
}

p+p {
    margin-top: 0;
}

p {
    color: var(----S-15, #999);
    text-align: center;
    font-family: var(--font-ibm-mono);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 128.571%;
    letter-spacing: 0.1rem;
}

p.rules {
    text-align: center;
    display: grid;
    gap: 0.5rem;
    background-color: var(--background-color);
}

.dropzone-label {
    color: var(--copy-color);
    cursor: pointer;
    display: inline-block;
    padding: 0.5rem;
    border: 1px solid var(--input-border-color);
    border-radius: var(--input-border-radius);
}

.dropzone-input {
    display: none;
}

.active {
    border: 1px solid var(--primary-color-base);
    // background-color: var(--grey-80);
}
</style>