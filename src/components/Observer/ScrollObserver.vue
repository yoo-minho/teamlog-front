<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const emits = defineEmits<{
  (eventName: 'triggerIntersected', value: Element): void;
  (eventName: 'hiddenEvent'): void;
}>();

const trigger = ref();

interface IntersectionObserverEntryV2 extends IntersectionObserverEntry {
  isVisible: boolean;
}

let observer: IntersectionObserver | null = null;
const handleIntersect = (entry: IntersectionObserverEntryV2): void => {
  if (entry.isIntersecting) return emits('triggerIntersected', trigger.value);
  if (entry.isVisible === false) return emits('hiddenEvent');
};
onMounted(() => {
  try {
    observer = new IntersectionObserver(
      (entries) => {
        handleIntersect(entries[0] as IntersectionObserverEntryV2);
      },
      { root: null, threshold: 0 },
    );
    observer.observe(trigger.value);
  } catch (err) {
    console.error(err);
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>
<template>
  <div ref="trigger"><slot></slot></div>
</template>
