<template>
    <li class="bingo-line-item">
        <span>
            <slot></slot>
        </span>
        <button @click="$emit('delete')">
            <Icon name="trash" size="20" />
        </button>
    </li>
</template>
<style lang="scss">
.bingo-line-item {
    background-color: rgb(0, 2, 18);
    padding: 0.25rem;
    border-radius: 0.25rem;
    display: flex;
    min-height: 2.75rem;
    height: 100%;
    &>span {
        display: inline-block;
        margin-right: auto;
    }
    
    &:hover {
        // filter: brightness(1.4);
        &>button {
            display: flex;
        }
    }

    &>button {
        padding: 0.25rem;
        border-radius: 0.25rem;
        background-color: rgba(39, 13, 126, 0.64);
        backdrop-filter: blur(2px);
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        bottom: 0.5rem;
        height: calc(100% - (2* 0.5rem));
        display: none;
        transition: all 160ms ease-in;
        &:hover{
            filter: brightness(1.333);
        }
        &>.icon{
            margin: auto;
        }
    }
}
</style>