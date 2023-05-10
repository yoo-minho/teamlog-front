<script setup lang="ts">
import { Link } from "@/types/common";
import { getImageByBlogType, isTextImage } from "@/util/ImageUtil";

defineProps<{ linkData: Link; links?: boolean; posts?: boolean }>();
</script>

<template>
  <div>
    <template v-if="isTextImage(linkData.imagePath)">
      <q-avatar size="64px" color="black" text-color="white">
        <div class="text-h5 non-selectable">
          {{ linkData.title.substring(0, 2) }}
        </div>
      </q-avatar>
    </template>
    <template v-else>
      <q-avatar size="64px" class="shadow-1">
        <q-img
          :src="linkData.imagePath"
          :alt="linkData.title"
          class="image-64"
          no-spinner
          loading="eager"
        >
          <template #error>{{ linkData.title.substring(0, 1) }}</template>
        </q-img>
      </q-avatar>
    </template>
    <q-avatar
      :class="{ 'blog-icon': true, 'shadow-2': true, posts, links }"
      size="18px"
    >
      <q-img
        :src="getImageByBlogType(linkData.type)"
        :alt="linkData.title"
        :no-transition="true"
      />
      <q-tooltip>{{ linkData.type }}</q-tooltip>
    </q-avatar>
  </div>
</template>

<style scoped>
.blog-icon.links {
  position: absolute;
  margin-top: 48px;
  margin-left: -12px;
  /* position: relative;
  top: 20px;
  right: 12px; */
}

.blog-icon.posts {
  position: relative;
  top: 24px;
  right: 12px;
}
</style>
