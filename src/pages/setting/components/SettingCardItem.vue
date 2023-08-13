<script setup lang="ts">
const props = defineProps<{
  icon: string;
  title: string;
}>();
const { icon, title } = toRaw(props);
</script>

<template>
  <q-item clickable dense>
    <q-item-section avatar top>
      <q-avatar :icon="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label lines="1">{{ title }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-icon name="navigate_next" />
    </q-item-section>
  </q-item>
</template>

<style></style>
