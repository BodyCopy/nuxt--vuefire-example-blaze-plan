<template>
    <kbd class="base-kbd">
        <slot></slot>
    </kbd>
</template>
<style lang="scss">
.base-kbd{
    // font: var(--font-ibm-mono);
    border: var(--line-break);
    font-size: 12px;
    padding: 2px 4px 3px 4px;
    border-radius: 3px;
    box-shadow: 0px 1px 0px var(--grey-80);
}
</style>