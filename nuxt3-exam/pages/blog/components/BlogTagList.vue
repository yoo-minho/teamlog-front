<script setup lang="ts">
import { getImage } from "@/utils/ImageUtil";
import { BLOG_TAG } from "@/constants";
import { Tag } from "@/types/common";

const route = useRoute();
const totalTag = { id: "All", name: "All" };
const props = defineProps<{ tags: Tag[] | null; activeTagName: string }>();
const emits = defineEmits<{ (eventName: "clickTag", tagName: string): void }>();
const isActiveTag = (tagName: string) => {
  const _activeTagName = props.activeTagName;
  if (_activeTagName === "" && tagName === "All") return true;
  return _activeTagName === tagName;
};

const clickTag = async (tagName: string) => {
  await navigateTo({ path: "blog", query: { ...route.query, tag: tagName } });
  emits("clickTag", tagName);
};

const getLabel = (type: string) => {
  return BLOG_TAG.find((v) => v.type === type)?.label || "All";
};
</script>

<template>
  <div v-if="tags" class="tag-scroll row q-mx-sm items-center wrap">
    <q-chip
      v-for="(tag, i) in [totalTag, ...tags]"
      :key="i"
      :class="{ active: isActiveTag(tag.name) }"
      outline
      square
      clickable
      color="dark"
      style="opacity: 0.8"
      @click="clickTag(tag.name || '')"
    >
      <q-avatar v-if="tag.name !== 'All'" size="18px">
        <q-img
          :src="getImage(`platform/${tag.name.toLowerCase()}.png`)"
          :no-transition="true"
        />
      </q-avatar>
      {{ getLabel(tag.name) }}
    </q-chip>
  </div>
</template>
<style lang="scss">
.tag-scroll {
  margin: 8px 12px;

  .q-scrollarea__content {
    display: flex;
  }
  .active {
    font-weight: bolder;
    color: $dark;
    background: $green-5 !important;
  }
}
</style>
