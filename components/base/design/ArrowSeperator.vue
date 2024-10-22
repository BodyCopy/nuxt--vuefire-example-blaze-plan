<template>
    <div class="arrow-seperator" aria-hidden="true">
        <span class="seperator"></span>
        <div>
            <IconArrow direction="down" class="XX"></IconArrow>
            <IconArrow direction="down" class="XX"></IconArrow>
            <IconArrow direction="down" class="XX"></IconArrow>
        </div>
        <span class="seperator"></span>
    </div>
</template>
<style lang="scss">
.arrow-seperator {
    width: 100%;
    position: relative;
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    align-items: center;
    gap: 0.5rem;

    &>.seperator {
        display: inline-block;
        width: 100%;
        background-color: var(--S-35);
        height: 1px;
    }
}
</style>
