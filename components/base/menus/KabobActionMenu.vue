<template>
    <div ref="menuRef" class="kabob-action-menu">
        <BaseIconButton ref="menuButton" btnStyle="neutral" class="action-menu-button" @click="showMenuAction">
            <!-- <IconKabob /> -->
             ::
        </BaseIconButton>
        <BaseMenu :class="['action-menu', menuPosition]" v-if="showMenu" :menuItems="props.menuItems"></BaseMenu>
    </div>
</template> 
<script setup>
import { ref, computed, inject } from 'vue';
import { onClickOutside, useElementBounding } from '@vueuse/core';
// import IconKabob from '@/components/icons/IconKabob.vue';
const props = defineProps({
    menuPosition: String,
    index: Number,
    menuItems: { type: Array, default: [{ label: 'test', action() { console.log(this.label) }, loading: false }] }
});

const menuRef = ref(null);
const showMenu = ref(false);
function showMenuAction() {
    showMenu.value = !showMenu.value;
}

onClickOutside(
    menuRef,
    (event) => {
        if (showMenu.value) {
            console.log(event)
            showMenu.value = false
        }
    },
)

// const { x, y, width, height } = useElementBounding(menuRef);
// const menuTeleport = computed(() => {
//     return {
//         top: (y.value) + 'px',
//         left: (window.scrollX + x.value) + 'px'
//     }
// })
async function deleteUpload() {
    const menuItem = menuItems.value.find(item => item.action === deleteUpload);
    menuItem.loading = true;
    let output;
    try {
        output = await uploadsStore.deleteUpload(props.index);
    } finally {
        runAction(output);
        menuItem.loading = false;
    }
}

</script>
<style lang="scss" scoped>
.kabob-action-menu {
    position: relative;
    --icon-button-size: 40px;
    width: max-content;
    --svg-fill-color: var(--copy-color-muted);
}

.action-menu {
    position: absolute;
    top: var(--icon-button-size);
    z-index: 999;

    &.left {
        left: 0;
    }

    &.right {
        right: 0;
    }

    &.top {
        top: 100%;
    }

    &.bottom {
        bottom: 0;
    }
}
</style>