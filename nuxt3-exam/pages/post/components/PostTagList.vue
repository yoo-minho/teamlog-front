<script setup lang="ts">
import TagList from '@/components/TagList.vue';
</script>

<template>
  <TagList v-slot="{ tagName }" name="Post">{{ tagName === 'All' ? '' : '#' }}{{ tagName }}</TagList>
  <q-separator spaced style="height: 8px" />
</template>
