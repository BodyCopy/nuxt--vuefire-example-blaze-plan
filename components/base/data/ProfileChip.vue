<template>
    <div class="profile-chip">
        <RouterLink :to="`/accounts/${props.name}/${props.uuid}/profile`">
            <IconSmile style="height: 18px; width:18px;" v-if="!props.avatar" />
            <div v-else><img :src="props.avatar" alt="user avatar"></div>
            <span>{{ props.name || 'unknown' }}</span>
        </RouterLink>
    </div>
</template>
<script setup>
import IconSmile from '@/components/icons/IconSmile.vue';
const props = defineProps({ avatar: String, name: String, uuid: String })
</script>
<style lang="scss" scoped>
.profile-chip {
    display: flex;
    align-items: center;
    height: max-content;
    gap: 0.25rem;
    padding: 0.125rem;

    & .pixel-icon {
        overflow: visible;

    }

    &>a {
        display: flex;
        gap: 0.25rem;
        align-items: center;
        font-size: 0.875rem;

        &>span {
            margin-block-start: 0.125rem;
        }
    }
}
</style>