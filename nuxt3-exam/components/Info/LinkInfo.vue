<script setup lang="ts">
import { Link } from "@/types/common";
import { getImageByBlogType, isTextImage } from "@/utils/ImageUtil";

defineProps<{ linkData: Link; links?: boolean; posts?: boolean }>();
</script>

<template>
  <div>
    <template v-if="isTextImage(linkData.imagePath)">
      <q-avatar size="64px" color="black" text-color="white" class="shadow-1">
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
          :style="{ height: '100%' }"
        >
          <template #error>
            <div class="absolute-full flex flex-center bg-green-4 text-white">
              {{ linkData.title.substring(0, 1) }}
            </div>
          </template>
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
    </q-avatar>
  </div>
</template>

<style scoped>
.blog-icon.links {
  position: absolute;
  margin-top: 48px;
  margin-left: -12px;
}

.blog-icon.posts {
  position: relative;
  top: 24px;
  right: 12px;
}
</style>
