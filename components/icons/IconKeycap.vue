<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="24" viewBox="0 0 28 24" fill="none" class="icon-keycap">
        <rect stroke="var(--S-20)" fill="green" x="2" y="3" width="24"
            height="20" rx="2" ry="2"></rect>
        <rect stroke="var(--S-30)" fill="var(--background-color)" stroke-width="1px" stroke-linecap="round" stroke-linejoin="round" x="2"
            y="2" width="24" height="20" rx="2" ry="2"></rect>
        <text fill="var(--copy-color-muted)" x="14" y="13" text-anchor="middle" dominant-baseline="middle" style="font-size: 10px">
            <slot></slot>
        </text>
    </svg>
</template>
