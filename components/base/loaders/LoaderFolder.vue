<template>
    <div id="svg-wrapper" :style="{ height: props.height }">
        <svg width="100%" height="100%" viewBox="0 0 100 200" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <g id="page" x="0" y="0" stroke-width="var(--stroke-width)" fill="var(--background-color)" stroke="var(--stroke-color)">
                    <rect id="" x=" 0" y="0" width="70" height="50" />
                    <line x1="8" y1="10" x2="42" y2="10" />
                    <line x1="8" y1="20" x2="42" y2="20" />
                    <line x1="8" y1="30" x2="32" y2="30" />
                </g>
            </defs>
            <g>
                <path
                    d="M96,192.9v-49.7c0-1.7-1.4-3.1-3.1-3.1H41.3c-0.8,0-1.6-0.3-2.2-0.9l-6.2-6.2c-0.6-0.6-1.4-0.9-2.2-0.9H13.3
          c-0.8,0-1.6,0.3-2.2,0.9l-6.2,6.2c-0.6,0.6-0.9,1.4-0.9,2.2v51.6c0,1.7,1.4,3.1,3.1,3.1h85.7C94.6,196,96,194.6,96,192.9z"
                    fill="var(--background-color)" stroke="var(--stroke-color)" stroke-width="var(--stroke-width)" />
                <g id="pages">
                    <use id="page3" xlink:href="#page" x="20" y="-80" />
                    <use id="page2" xlink:href="#page" x="15" y="-75" />
                    <use id="page1" xlink:href="#page" x="10" y="-70" />
                </g>
                <path class="st0" d="M92.9,140H48c-0.8,0-1.6,0.3-2.2,0.9l-6.2,6.2c-0.6,0.6-1.4,0.9-2.2,0.9c0,0-33.4,0-33.4,0v44.9
                        c0,1.7,1.4,3.1,3.1,3.1h85.7c1.7,0,3.1-1.4,3.1-3.1v-49.7C96,141.4,94.6,140,92.9,140z"
                    fill="var(--background-color)" stroke="var(--stroke-color)" stroke-width="var(--stroke-width)" />
            </g>
        </svg>
    </div>
</template>
<script setup>
const props = defineProps(['height']);
</script>
<style scoped>
@keyframes slideIn1 {
    0% {
        transform: translateY(0%);
    }

    20% {
        transform: translateY(100%);
    }

    100% {
        transform: translateY(100%);
    }
}

@keyframes slideIn2 {
    0% {
        transform: translateY(0%);
    }

    20% {
        transform: translateY(0%);
    }

    40% {
        transform: translateY(100%);
    }

    100% {
        transform: translateY(100%);
    }
}

@keyframes slideIn3 {
    0% {
        transform: translateY(0%);
    }

    40% {
        transform: translateY(0%);
    }

    60% {
        transform: translateY(100%);
    }

    100% {
        transform: translateY(100%);
    }
}

@keyframes fadeOut {
    0% {
        opacity: 0;
    }
    5%{
        opacity: 0;
    }
    15% {
        opacity: 1;
    }
    70% {
        opacity: 1;
    }

    90% {
        opacity: 0;
    }

    100% {
        opacity: 0;
    }
}

svg {
    height: 100%;
    overflow: hidden;
    --_speed: 2.5s;
    --stroke-color: var(--B-45);
    --stroke-width: 1px;
}

#rect {}

#page1 {
    animation: var(--_speed) ease-in infinite slideIn1;
}

#page2 {
    animation: var(--_speed) ease-in infinite slideIn2;
}

#page3 {
    animation: var(--_speed) ease-in infinite slideIn3;
}

#pages {
    animation: var(--_speed) ease-in infinite fadeOut;
}
</style>