<template>
    <!-- <span>
        ѳѳ
    </span> -->
    <span class="glyph-link">
        <span>Ө</span>
        <span>Ө</span>
        <!-- <span>θ</span> -->
    </span>
    <!-- <span>
        <span>
            Ø
        </span>
        <span>
            Ø
        </span>
    </span> -->
</template>
<style>
span.glyph-link>span {
    color: var(--copy-color-muted);
    font-style: normal;
    font-weight: 400;
}

span.glyph-link:hover>span {
    color: var(--primary-color-darker);
    font-style: normal;
}

span.glyph-link>span:first-child,
span.glyph-link>span:last-child {
    font-size: 1.25em;
    display: inline-block;
    rotate: 70deg;
}

span.glyph-link>span:last-child {
    transform: translateX(-0.2em) translateY(-0.075em);
}
</style>
