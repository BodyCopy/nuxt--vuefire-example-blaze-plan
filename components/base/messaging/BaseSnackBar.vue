<template>
  <div :class="['snack-bar', type]">
    <span v-if="!noIcon" class="icon">
      <IconCheckCircle v-if="type === 'success'"></IconCheckCircle>
      <IconAlertCircle v-else-if="type === 'error'"></IconAlertCircle>
      <IconZap v-else-if="type === 'info'"></IconZap>
      <IconInfo v-else></IconInfo>
    </span>
    <p class="message-content">
      <slot></slot>
    </p>
    <BaseIconButton v-if="props.dismiss" @click="() => { emits('dismiss') }">
      <IconX />
    </BaseIconButton>
  </div>
</template>
<script setup>
import IconX from '@/components/icons/IconX.vue';
import IconCheckCircle from "@/components/icons/IconCheckCircle.vue";
import IconAlertCircle from "@/components/icons/IconAlertCircle.vue";
import IconInfo from "@/components/icons/IconInfo.vue";
import IconZap from "@/components/icons/IconZap.vue";
import { useAttrs, ref, onMounted, Teleport, Transition, watch } from "vue";

const attrs = useAttrs();
const props = defineProps(["noIcon", "type", 'dismiss']);
const emits = defineEmits(["dismiss"]);
const timeout = ref(null);

</script>
<style scoped>
.snack-bar {
  color: var(--content-color);
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  border-radius: 4px;
  padding: 1rem;
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  gap: 1rem;
  width: max-content;
}

.message-content {
  margin: 0;
  margin-top: 0.18rem;
  min-width: 20ch;
}

.icon {
  --svg-stroke-color: var(--content-color);
  padding-top: 0.2rem;
}
</style>
