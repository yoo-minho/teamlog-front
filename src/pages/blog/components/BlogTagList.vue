<script setup lang="ts">
import { getImage } from "@/utils/ImageUtil";
import { BLOG_TAG } from "@/constants";
import { Link, Tag } from "@/types/common";
import LinkDialog from "@/components/Dialog/LinkDialog.vue";
import BlogApi from "@/api/blogApi";
import RssApi from "@/api/rssApi";

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

const linkDisplay = ref(false);
const showLinkEditor = () => (linkDisplay.value = true);
const hideLinkEditor = () => (linkDisplay.value = false);
const saveLink = async (linkSelectData: Link) => {
  const { data, error } = await BlogApi.create(linkSelectData);
  if (error.value) {
    if (error.value.statusCode === 409) {
      Notify.create({ type: "negative", message: "이미 등록된 url입니다." });
      return;
    }
    Notify.create({ type: "negative", message: "이슈 발생!" });
    return;
  }
  const { rssUrl, url } = linkSelectData;
  const { id: linkId } = data.value as any;
  await RssApi.scrapPost(linkId, rssUrl || url);
  Notify.create({ type: "success", message: "등록되었습니다." });
  hideLinkEditor();
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
    <q-chip
      icon="add"
      outline
      square
      clickable
      color="green-5"
      style="opacity: 0.8"
      @click="showLinkEditor()"
    >
      블로그 등록하기
    </q-chip>
  </div>
  <LinkDialog
    :show="linkDisplay"
    @hide="hideLinkEditor()"
    @save-link="saveLink"
  />
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
    background: $green-3 !important;
  }
}
</style>
