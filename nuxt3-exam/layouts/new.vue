<script setup lang="ts">
import { useQuasar } from "quasar";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const emits = defineEmits<{
  (eventName: "save"): void;
}>();
const isMobile = $q.platform.is.mobile;
const isDarkActive = ref($q.dark.isActive);

watch(
  () => $q.dark.isActive,
  (val) => (isDarkActive.value = val)
);

const close = () => {
  router.back();
};
</script>

<template>
  <q-layout
    class="max-width"
    :class="`${isDarkActive ? 'bg-grey-9' : 'bg-white'}`"
  >
    <q-header bordered class="max-width bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="close" @click="close()" />
        <q-toolbar-title>{{ route.meta.title }}</q-toolbar-title>
        <q-btn flat round icon="done" @click="emits('save')" />
      </q-toolbar>
    </q-header>
    <q-page-container class="max-width">
      <q-scroll-area :visible="false" class="max-width without-header">
        <q-page class="q-pa-md max-width" :class="{ 'width-100vw': isMobile }">
          <q-form class="q-gutter-y-md column">
            <slot></slot>
          </q-form>
        </q-page>
      </q-scroll-area>
    </q-page-container>
  </q-layout>
</template>
<style scoped>
.width-100vw {
  width: 100vw;
}
</style>
