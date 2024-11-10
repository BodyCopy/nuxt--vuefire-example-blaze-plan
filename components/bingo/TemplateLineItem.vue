<template>
    <li class="template-line-item line-item">
        <LineItemData :creator="template.creator.displayName" :title="template.title" :game="template.game">
        </LineItemData>
        <BaseButton @click="createNewRoomWithTemplate" btn-style="outline">New room</BaseButton>
        <KabobActionMenu :menuItems="menuItems"></KabobActionMenu>
    </li>
</template>
<script setup>
import { humanReadableDate } from '~/utilities/dateUtilities';
const router = useRouter();
const props = defineProps({ template: Object });
const menuItems = [
    {
        label: 'Edit', action() {
            console.log(this.label);
        }
    },
    {
        label: 'Delete', action() {
            console.log(this.label);
        }
    }
]
async function createNewRoomWithTemplate() {
    router.push({ path: `/bingo-template-creator`, query: { templateId: props.template.id, game: props.template.game } });
}
const createdOn = computed(() => {
    if (props.template.createdOn) {
        let date = props.template.createdOn.toDate();
        return humanReadableDate(date);
    } else {
        return false;
    }
})
</script>
<style lang="scss">
.template-line-item {
    display: grid;
    grid-template-columns: 1fr repeat(2, max-content);
}
</style>