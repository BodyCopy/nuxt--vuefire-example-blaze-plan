<template>
    <div class="line-item__data">
        <h5>{{ title || 'Anon room' }}</h5>
        <dl class="line-item__data-meta">
            <dt>C</dt>
            <dd>{{ creator || 'Anon creator' }}</dd>
            <dt>G</dt>
            <dd>{{ game || 'Anon game' }}</dd>
        </dl>
    </div>
</template>
<script setup>
const props = defineProps({ title: String, creator: String, game: String })
</script>
<style lang="scss">
.line-item__data {
    display: grid;
    gap: 0.125rem;
}

dl.line-item__data-meta {
    display: flex;
    font-size: 0.875rem;

    &>dt {
        color: var(--Y-33);
        margin-inline-end: 0.5rem;

        &:after {
            margin-left: 0.25rem;
            content: '/'
        }
    }

    &>dd {
        color: var(--B-15);

        &:has(+ dt) {
            margin-inline-end: 1rem;
        }
    }
}
</style>