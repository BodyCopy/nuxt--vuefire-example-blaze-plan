<template>
    <svg :class="empty ? 'empty' : ''" width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g id="IconGeoIce" stroke-width="var(--svg-stroke-width)" stroke-linecap="round" stroke-linejoin="round">
            <path fill="var(--temp-chill)" id="surface surface-2"
                d="M3.26846 7.00098C3.09294 7.30462 3.00036 7.64909 3 7.99981V15.9998C3.00036 16.3505 3.09294 16.695 3.26846 16.9987L12 11.9998L3.26846 7.00098Z" />
            <path fill="var(--temp-chill)" id="surface surface-1"
                d="M3.26831 16.9988C3.44383 17.3025 3.69611 17.5546 3.99985 17.73L10.9998 21.73C11.3039 21.9055 11.6488 21.998 11.9998 21.998V12L3.26831 16.9988Z" />
            <path fill="var(--temp-frost)" id="surface surface-3"
                d="M11.9998 2.00195C11.6488 2.00195 11.3039 2.09437 10.9998 2.2699L3.99985 6.2699C3.69611 6.44526 3.44383 6.69742 3.26831 7.00106L11.9998 11.9999V2.00195Z" />
            <path fill="var(--temp-frost)" id="surface surface-4"
                d="M20.7315 7.00106C20.556 6.69742 20.3037 6.44526 20 6.2699L13 2.2699C12.696 2.09437 12.3511 2.00195 12 2.00195V11.9999L20.7315 7.00106Z" />
            <path fill="var(--temp-freeze)" id="surface surface-5"
                d="M21 15.9998V7.99981C20.9996 7.64909 20.9071 7.30462 20.7315 7.00098L12 11.9998L20.7315 16.9987C20.9071 16.695 20.9996 16.3505 21 15.9998Z" />
            <path fill="var(--temp-freeze)" id="surface surface-6"
                d="M12 21.998C12.3511 21.998 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988L12 12V21.998Z" />
            <path id="vertex" stroke="var(--vertex-stroke-ice)"
                d="M20.7315 7.00106C20.9071 7.30471 20.9996 7.64918 21 7.9999V15.9999C20.9996 16.3506 20.9071 16.6951 20.7315 16.9987M20.7315 7.00106C20.556 6.69742 20.3037 6.44526 20 6.2699L13 2.2699C12.696 2.09437 12.3511 2.00195 12 2.00195M20.7315 7.00106L12 11.9999M12 2.00195C11.6489 2.00195 11.304 2.09437 11 2.2699L4 6.2699C3.69626 6.44526 3.44398 6.69742 3.26846 7.00106M12 2.00195V11.9999M3.26846 7.00106C3.09294 7.30471 3.00036 7.64918 3 7.9999V15.9999C3.00036 16.3506 3.09294 16.6951 3.26846 16.9987M3.26846 7.00106L12 11.9999M3.26846 16.9987C3.44398 17.3024 3.69626 17.5545 4 17.7299L11 21.7299C11.304 21.9054 11.6489 21.9979 12 21.9979M3.26846 16.9987L12 11.9999M12 21.9979C12.3511 21.9979 12.696 21.9054 13 21.7299L20 17.7299C20.3037 17.5545 20.556 17.3024 20.7315 16.9987M12 21.9979V11.9999M20.7315 16.9987L12 11.9999" />
        </g>
    </svg>
</template>
<script setup>
const props = defineProps(['empty']);
</script>
<style scoped>
svg {
    fill: var(--svg-fill, transparent);
    display: block;
}

svg.empty {
    --vertex-stroke-ice: var(--B-40);
    --background-color: transparent;
    --temp-spark: var(--background-color);
    --temp-burn: var(--background-color);
    --temp-blaze: var(--background-color);
    --temp-chill: var(--background-color);
    --temp-frost: var(--background-color);
    --temp-freeze: var(--background-color);
}
</style>