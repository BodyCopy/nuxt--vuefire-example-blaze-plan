<template>
    <TopNav></TopNav>
    <main class="default-layout">
        <header>
            <h1>{{ route.meta.title || 'Default Title' }}</h1>
        </header>
        <slot></slot>
    </main>
    <svg xmlns='http://www.w3.org/2000/svg' class="invisible-element" aria-hidden="true">
        <filter id='noiseFilter' primitive-units="objectBoundingBox" height="200%">
            <feTurbulence type='fractalNoise' baseFrequency='5' numOctaves='5' stitchTiles='stitch' />
        </filter>
    </svg>
</template>
<script setup>
const route = useRoute();
useHead({
    title: route.meta.title || 'Default Title',
});
</script>
<style lang="scss">
.default-layout {
    display: grid;
    &>main{
        padding: 0 0.5rem 0.5rem 0.5rem;
    }
    &>header {
        padding: 0.5rem;

        &>h1 {
            color: var(--S-05);
            margin-inline-end: auto;
            font-size: 1.5rem;
        }
    }
}
</style>