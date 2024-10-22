<template>
    <div class="event-log-item">
        <div v-for="(val, key) in props.item">
            <span>{{ key }}</span>
            <span>{{ val }}</span>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({ item: Object });
</script>
<style lang="scss"></style>