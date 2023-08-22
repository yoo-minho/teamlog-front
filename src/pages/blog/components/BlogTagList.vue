<script setup lang="ts">
import { getImage } from "@/utils/ImageUtil";
import { BLOG_TAG } from "@/constants";
import { Link, Tag } from "@/types/common";
import LinkDialog from "@/components/Dialog/LinkDialog.vue";
import BlogApi from "@/api/blogApi";
import RssApi from "@/api/rssApi";

const route = useRoute();
const totalTag = { id: "All", name: "전체 플랫폼" };
const props = defineProps<{
  tags: Tag[] | null;
  activeTagName: string;
  isWithTeam: boolean;
}>();
const { isWithTeam } = toRefs(props);
const emits = defineEmits<{
  (eventName: "clickTag", tagName: string): void;
  (eventName: "clickWithTeamFilter", is?: boolean): void;
  (eventName: "refresh", options: { init: boolean }): void;
}>();

const clickTag = async (tagName: string) => {
  if (tagName === totalTag.name) {
    await navigateTo({ path: "blog" });
    emits("clickTag", "");
    return;
  }
  await navigateTo({ path: "blog", query: { ...route.query, tag: tagName } });
  emits("clickTag", tagName);
};

const clickWithTeamFilter = () => emits("clickWithTeamFilter");
const getLabel = (type: string) =>
  BLOG_TAG.find((v) => v.type === type)?.label || totalTag.name;

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
  emits("refresh", { init: true });
};
</script>

<template>
  <div
    class="q-px-md q-gutter-sm"
    style="padding-top: 12px; padding-bottom: 4px"
  >
    <q-btn-dropdown
      color="primary"
      :label="getLabel(activeTagName)"
      dense
      size="12px"
      rounded
      style="padding-left: 1em; height: 28px"
    >
      <q-list v-if="tags">
        <q-item
          v-for="(tag, i) in [totalTag, ...tags]"
          clickable
          v-close-popup
          @click="clickTag(tag.name || '')"
        >
          <q-item-section avatar>
            <q-avatar size="18px" rounded>
              <q-img
                :src="getImage(`platform/${tag.name.toLowerCase()}.png`)"
                :no-transition="true"
              />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ getLabel(tag.name) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn
      area-label="withTeamFilter"
      rounded
      dense
      size="12px"
      style="padding-left: 1em; padding-right: 1em; height: 28px"
      no-caps
      :icon-right="`toggle_${isWithTeam ? 'on' : 'off'}`"
      color="primary"
      @click="clickWithTeamFilter"
    >
      {{ isWithTeam ? "with" : "without" }} Team　
    </q-btn>
    <q-btn
      area-label="showLinkEditor"
      icon="add"
      clickable
      rounded
      dense
      size="12px"
      color="green-4"
      style="padding-left: 0.5em; padding-right: 1em; height: 28px"
      @click="showLinkEditor()"
    >
      블로그 등록하기
    </q-btn>
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
