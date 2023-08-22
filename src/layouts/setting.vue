<script setup lang="ts">
const $q = useQuasar();
const [route, router] = [useRoute(), useRouter()];
const isDarkActive = ref($q.dark.isActive);

const back = () => router.back();

watch(
  () => $q.dark.isActive,
  (val) => (isDarkActive.value = val)
);
</script>

<template>
  <q-layout
    class="subpage max-width"
    :class="`${isDarkActive ? 'bg-grey-9' : 'bg-white'}`"
  >
    <q-header bordered class="bg-primary text-white max-width">
      <q-toolbar>
        <q-btn
          area-label="back"
          flat
          round
          dense
          icon="keyboard_backspace"
          @click="back()"
        />
        <q-toolbar-title>{{ route.meta.title }}</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container class="max-width">
      <q-scroll-area
        class="max-width without-header"
        :visible="false"
        :thumb-style="{ zIndex: '999999' }"
      >
        <slot></slot>
      </q-scroll-area>
    </q-page-container>
  </q-layout>
</template>
