<template>
    <i v-html="iconContent" v-if="iconContent" :class="['icon', size]" aria-hidden="true">
    </i>
</template>
<script setup>
const props = defineProps({ name: { type: String, required: true }, size: { type: String } });
const iconContent = ref(null);
const size = computed(() => {
    return {
        XVI: props.size.toString() === '16',
        XX: props.size.toString() === '20',
        XXIV: props.size.toString() === '24',
        XXXII: props.size.toString() === '32',
        XXXXVIII: props.size.toString() === '48',
    }
})
// Dynamically load the SVG based on the prop
watchEffect(async () => {
    if (props.name) {
        try {
            iconContent.value = (await import(`~/assets/icons/${props.name}.svg?raw`)).default;
        } catch (e) {
            console.error(`Icon ${props.name} not found`);
        }
    }
});
</script>
<style lang="scss">
i.icon {
    display: inline-block;
    margin: auto;
    height: auto;

    &.XVI {
        width: 16px;
    }

    &.XX {
        width: 20px;
    }

    &.XXIV {
        width: 24px;
    }

    &.XXXII {
        width: 32px;
    }

    &.XXXVIII {
        width: 48px;
    }
}

svg.feather {
    width: 100%;
    height: auto;
}
</style>