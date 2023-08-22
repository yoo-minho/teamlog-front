<script setup lang="ts">
import { Post } from "@/types/common";
import { openUrl } from "@/utils/CommUtil";
import { getDateString } from "@/plugin/dayjs";
import { skipBlogName } from "@/utils/NameUtil";
import { getImageByBlogType, isTextImage } from "@/utils/ImageUtil";

const props = defineProps<{ post: Post; selectedTag?: string }>();
const { post } = toRefs(props);
const changeTitle = (title: string) => {
  if (!props.selectedTag || props.selectedTag === "All") return title;
  return changeMarkContents(title, props.selectedTag);
};
</script>

<template>
  <q-item-label class="cursor-pointer" @click="openUrl(post.url)">
    <q-item>
      <q-item-section>
        <template v-if="!props.selectedTag || props.selectedTag === 'All'">
          <h3 style="font-size: 16px">{{ post.title }}</h3>
        </template>
        <template v-else>
          <div
            class="label text-weight-bold ellipsis text-subtitle2"
            v-html="changeTitle(post.title)"
          ></div>
        </template>

        <div class="label ellipsis-2-lines" style="line-height: 20px">
          {{ post.description || "" }}
        </div>
        <div class="label text-grey-5 ellipsis">
          {{ getDateString(post.createdAt) }}
        </div>
        <div class="row items-center">
          <q-avatar
            v-if="isTextImage(post.link.imagePath)"
            color="black"
            text-color="white"
            size="20px"
            rounded
          >
            <div class="non-selectable">
              {{ post.link.title.substring(0, 2) }}
            </div>
          </q-avatar>
          <q-avatar v-else size="20px" class="shadow-2" rounded>
            <q-img
              :src="post.link.imagePath"
              :alt="post.link.title"
              class="image-24"
              no-spinner
              loading="eager"
              :style="{ height: '100%' }"
            >
              <template #error>
                <div
                  class="absolute-full flex flex-center bg-green-4 text-white"
                  :style="{ padding: '0' }"
                >
                  {{ post.link.title.substring(0, 1) }}
                </div></template
              >
            </q-img>
          </q-avatar>
          <q-item-label class="q-mx-sm" style="flex: 1">
            <span class="text-weight-bold ellipsis text-grey-5">
              <h4>{{ skipBlogName(post.link.title) }}</h4>
            </span>
            <div v-if="post.link.groups?.length > 0" class="text-grey-5">
              in
              <span
                class="ellipsis"
                style="font-size: 12px; letter-spacing: -0.5px"
              >
                {{
                  post.link.groups.map(({ group }) => group.title).join(", ")
                }}
              </span>
            </div>
          </q-item-label>
          <q-avatar rounded size="20px">
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
