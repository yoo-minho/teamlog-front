<script setup lang="ts">
import { Post } from "@/types/common";
import { openUrl } from "@/utils/CommUtil";
import { getDateString } from "@/plugin/dayjs";
import { skipBlogName } from "@/utils/NameUtil";
import { getImageByBlogType, isTextImage } from "@/utils/ImageUtil";

const props = defineProps<{ post: Post }>();
const { post } = toRefs(props);
</script>

<template>
  <q-item-label class="cursor-pointer" @click="openUrl(post.url)">
    <q-item>
      <q-item-section>
        <div
          class="label text-weight-bold ellipsis text-subtitle2"
          v-html="post.title"
        ></div>
        <div class="label ellipsis-2-lines" style="line-height: 20px">
          {{ post.description || "ㅤ" }}
        </div>
        <div class="label text-grey-5 ellipsis">
          {{ getDateString(post.createdAt) }}
        </div>
        <div class="row items-center">
          <q-avatar
            v-if="isTextImage(post.link.imagePath)"
            color="black"
            text-color="white"
            rounded
            size="24px"
          >
            <div class="non-selectable" style="font-size: 12px">
              {{ post.link.title.substring(0, 2) }}
            </div>
          </q-avatar>
          <q-avatar v-else rounded size="24px" class="shadow-2">
            <q-img
              :src="post.link.imagePath"
              :alt="post.link.title"
              class="image-"
              no-spinner
              loading="eager"
            >
              <template #error>{{ post.link.title.substring(0, 1) }}</template>
            </q-img>
          </q-avatar>
          <q-item-label class="text-grey-5 ellipsis q-mx-sm" style="flex: 1">
            <span class="text-weight-bold">{{
              skipBlogName(post.link.title)
            }}</span>
          </q-item-label>
          <q-avatar rounded size="24px">
            <q-img
              :src="getImageByBlogType(post.link.type)"
              :alt="post.link.title"
            />
          </q-avatar>
        </div>
      </q-item-section>
    </q-item>
    <q-separator spaced />
  </q-item-label>
</template>
<style lang="scss">
mark {
  color: $green-4;
  background: $grey-2;
}
.label {
  margin-bottom: 8px;
  max-width: inherit;
}
</style>
