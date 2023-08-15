<script setup lang="ts">
import { Link } from "@/types/common";
import { openUrl } from "@/utils/CommUtil";
import { skipBlogName } from "@/utils/NameUtil";
import { getFormatString } from "@/plugin/dayjs";
import BlogAvatarItem from "./BlogAvatarItem.vue";

const props = defineProps<{ link: Link }>();
const { link } = toRefs(props);

const blogName = skipBlogName(link.value.title);
const blogDesc = link.value.description || "Need a description!";
const dateString = getFormatString(
  link.value.lastPostCreatedAt,
  "YYYY-MM-DD HH:mm (ddd)"
);
</script>

<template>
  <q-item-label class="cursor-pointer" @click="openUrl(link.url)">
    <q-item>
      <q-item-section side>
        <BlogAvatarItem
          :title="link.title"
          :image-path="link.imagePath"
          :type="link.type"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-weight-bold ellipsis text-subtitle2">
          <q-icon name="launch" />
          {{ blogName }}
        </q-item-label>
        <q-item-label class="ellipsis-2-lines text-grey-7">
          {{ blogDesc }}
        </q-item-label>
        <q-item-label class="ellipsis text-grey-5">{{ link.url }}</q-item-label>
        <q-item-label class="text-grey-5">
          {{ dateString }}
        </q-item-label>
        <div class="text-grey-5 q-mt-xs">
          in
          <span
            class="ellipsis"
            style="font-size: 12px; letter-spacing: -0.5px"
          >
            {{ link.groups.map(({ group }) => group.title).join(", ") }}
          </span>
        </div>
      </q-item-section>
    </q-item>
  </q-item-label>
  <q-separator spaced />
</template>
<style lang="scss"></style>
