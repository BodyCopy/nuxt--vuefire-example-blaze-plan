<template>
    <div class="fake-input-grid">

    </div>
</template>
<script setup>
import FakeInput from './FakeInput.vue';
import FakeInputList from './FakeInputList.vue';
const props = defineProps({ data: Array });
/*
data
[
    {
        name:category,
        settings:Object,
        items:[
            {
                label:String,
                type:String,
                data:String
            }
        ]
    }
]
*/
</script>
<style lang="scss">
.fake-input-grid {
    container: fake-input-grid-container / inline-size;
}
</style>