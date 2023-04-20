<script setup lang="ts">
import TagList from '@/components/TagList.vue';
import { getImage } from '@/util/ImageUtil';
import { BLOG_TAG } from '@/constants';

const getLabel = (type: string) => {
  return BLOG_TAG.find((v) => v.type === type)?.label || 'All';
};
</script>

<template>
  <TagList v-slot="{ tagName }" name="Blog">
    <q-avatar v-if="tagName !== 'All'" size="18px">
      <q-img :src="getImage(`platform/${tagName.toLowerCase()}.png`)" :no-transition="true" />
    </q-avatar>
    {{ getLabel(tagName) }}
  </TagList>
  <q-separator spaced style="height: 8px" />
</template>
