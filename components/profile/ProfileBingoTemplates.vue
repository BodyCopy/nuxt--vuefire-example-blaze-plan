<template>
    <div>
        <h2>Templates:</h2>
        <ul v-if="templates">
            <li v-for="template in templates">
                <BaseButton @click="" btn-style="filled">Create room</BaseButton>
                {{ template?.createdOn || 'Templates go here' }}
                <ul>
                    <li v-for="item in template.bingoItems">
                        {{ item }}
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script setup>
const props = defineProps({ templates: { type: Array } });
</script>
<style lang="scss"></style>