<template>
    <div>
        <h2>Templates:</h2>
        <LineItemGrid v-if="templates">
            <template #grid-items>
                <TemplateLineItem v-for="template in templates" :template="template"></TemplateLineItem>
            </template>
        </LineItemGrid>
    </div>
</template>
<script setup>
const props = defineProps({ templates: { type: Array } });
</script>
<style lang="scss"></style>