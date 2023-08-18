<script setup lang="ts">
import { BlogType } from "@/types/common";
import { getImageByBlogType, isTextImage } from "@/utils/ImageUtil";

const props = defineProps<{
  title: string;
  imagePath?: string;
  type: BlogType;
}>();
const { type } = toRefs(props);

const blogIcon = getImageByBlogType(type.value);
</script>
<template>
  <div>
    <template v-if="isTextImage(imagePath)">
      <q-avatar
        size="64px"
        color="black"
        text-color="white"
        class="shadow-1"
        rounded
      >
        <div class="text-h5 non-selectable">
          {{ title.substring(0, 2) }}
        </div>
      </q-avatar>
    </template>
    <template v-else>
      <q-avatar size="64px" class="shadow-1" rounded>
        <nuxt-img :src="imagePath"></nuxt-img>
        <q-img
          :src="imagePath"
          :alt="title"
          class="image-64"
          no-spinner
          loading="eager"
          :style="{ height: '100%' }"
        >
          <template #error>
            <div class="absolute-full flex flex-center bg-green-4 text-white">
              {{ title.substring(0, 1) }}
            </div>
          </template>
        </q-img>
      </q-avatar>
    </template>
    <q-avatar class="blog-icon shadow-2" size="18px" rounded>
      <q-img :src="blogIcon" :alt="title" :no-transition="true" />
    </q-avatar>
  </div>
</template>

<style scoped>
.blog-icon {
  position: relative;
  top: 24px;
  right: 12px;
}

.blog-icon.links {
  position: absolute;
  margin-top: 48px;
  margin-left: -12px;
}
</style>
