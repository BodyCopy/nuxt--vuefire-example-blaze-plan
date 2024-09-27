<template>
    <menu class="base-menu thin-scrollbar">
        <li v-if="props.menuItems" v-for="item in props.menuItems">
            <BaseMenuButton :tab-index="props.tabIndex" @click="menuItemEvent(item)" :loading="item.loading">{{ item.label
            }}</BaseMenuButton>
        </li>
        <template v-else>
            <slot></slot>
        </template>
    </menu>
</template>
<script setup>
/** 
 * @typedef {Object} menuItem
 * @property {string} hType - the heading type
 * @property {string} content - the heading content
 *
 * @param {menuItem} payload - the components payload
 * */
//const menuItems = ref([{ label: 'Delete', action: deleteUpload, loading: false }, { label: enterExit, action: enterContest, loading: false }]);
const props = defineProps({ menuItems: { type: Array }, tabIndex: Number });
function menuItemEvent(item) {
    item.action();
    emits('menu-item-event', item.label);
}
const emits = defineEmits(['menu-item-event']);
</script>
<style>
.base-menu {
    padding: 0.5rem 0;
    min-width: 16ch;
    background-color: var(--background-color);
    max-height: max(200px, 40svh);
    overflow-y: auto;
}
</style>