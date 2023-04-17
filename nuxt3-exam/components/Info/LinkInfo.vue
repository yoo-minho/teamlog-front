<script setup lang="ts">
import { Link } from '@/types/common';
import { getImageByBlogType, isTextImage } from '@/util/ImageUtil';
import { skipBlogName } from '@/util/NameUtil';

defineProps<{ linkData: Link; links?: boolean; posts?: boolean }>();
</script>

<template>
  <div>
    <q-avatar v-if="isTextImage(linkData.imagePath)" color="black" text-color="white" rounded>
      <div class="text-h6 non-selectable">{{ linkData.title.substring(0, 2) }}</div>
      <q-tooltip>{{ linkData.title }}<br />{{ linkData.url }}</q-tooltip>
    </q-avatar>
    <q-avatar v-else rounded size="48px" class="shadow-1">
      <q-img :src="linkData.imagePath" :alt="linkData.title" class="image-48" no-spinner loading="eager">
        <template #error>{{ linkData.title.substring(0, 1) }}</template>
      </q-img>
      <q-tooltip>{{ skipBlogName(linkData.title) }}<br />{{ linkData.url }}</q-tooltip>
    </q-avatar>
    <q-avatar :class="{ 'blog-icon': true, 'shadow-2': true, posts, links }" rounded size="18px">
      <img :src="getImageByBlogType(linkData.type)" :alt="linkData.title" />
      <q-tooltip>{{ linkData.type }}</q-tooltip>
    </q-avatar>
  </div>
</template>

<style scoped>
.blog-icon.links {
  position: relative;
  top: 20px;
  right: 12px;
}

.blog-icon.posts {
  position: relative;
  top: 24px;
  right: 8px;
}
</style>
