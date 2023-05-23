<script setup lang="ts">
import { useQuasar } from "quasar";

const $q = useQuasar();
const value = ref($q.dark.isActive);
const toggleDarkMode = () => {
  $q.dark.toggle();
  $q.localStorage.set("mode", $q.dark.isActive ? "dark" : "light");
};
const clickDarkMode = () => {
  value.value = !value.value;
  toggleDarkMode();
};
</script>

<template>
  <q-item clickable @click="clickDarkMode">
    <q-item-section avatar top>
      <q-avatar :icon="`${$q.dark.isActive ? 'dark' : 'light'}_mode`" />
    </q-item-section>
    <q-item-section>
      <q-item-label lines="1">다크모드</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-toggle v-model="value" @update:model-value="toggleDarkMode" />
    </q-item-section>
  </q-item>
</template>

<style></style>
