<template>
    <component :is="props.tag" class="calculator-screen">
        <p>CaculatorScreenWorks</p>
        <slot name="content"></slot>
    </component>
</template>
<script setup lang="ts">
const props = defineProps({ tag: { type: String, default: 'div' } });
</script>