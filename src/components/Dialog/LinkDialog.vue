<script setup lang="ts">
import { ErrorMessage, Link } from "@/types/common";
import { scrapOGS } from "@/composables/useOgs";
import { BLOG_TAG, BLOG_EXPRESSION } from "@/constants";
import { QInput } from "quasar";

const props = defineProps<{ show: boolean }>();
const emits = defineEmits<{ (eventName: "saveLink", link: Link): void }>();
const show = toRef(props, "show");
const _show = ref(false);
watch(show, (value) => {
  _show.value = value;
});

const linkRules = [
  (val: string): ErrorMessage =>
    val.includes("https\:\/\/") ||
    "'https://'로 시작하는 블로그URL을 적어주세요",
];

const getErrorMessage = (v: string): string => {
  const resultArr = linkRules.map((func) => func(v));
  if (typeof resultArr[0] === "string") return resultArr[0];
  return "";
};

const url = ref("");
const rssUrl = ref("");
const isShowRssUrl = ref(false);

const initRef = () => {
  url.value = "";
  rssUrl.value = "";
  isShowRssUrl.value = false;
};

const isAutoRssUrl = (url: string) =>
  Object.entries(BLOG_EXPRESSION)
    .map(([, v]) => v)
    .reduce((result, curr) => new RegExp(curr).test(url) || result, false);

const checkUrl = () => {
  rssUrl.value = "";
  if (url.value.length <= "https://".length || isAutoRssUrl(url.value)) {
    isShowRssUrl.value = false;
    return;
  }
  isShowRssUrl.value = true;
};

const saveLink = async () => {
  const errMessage = getErrorMessage(url.value);
  if ("" !== errMessage) {
    Notify.create({ type: "negative", message: errMessage });
    return;
  }

  const response = await scrapOGS(url.value);
  const { error, errorMessage } = response;
  const { url: ogsUrl, type, title, description, imagePath } = response;
  if (error) {
    Notify.create({ type: "negative", message: errorMessage });
    return;
  }

  const addSlash = (str: string) =>
    (str.endsWith("/") ? str : str + "/").replace(/\/+$/, "/");
  const link = {
    rssUrl: rssUrl.value,
    url: addSlash(ogsUrl),
    type,
    title,
    description,
    imagePath,
  } as Link;
  emits("saveLink", link);
};

const linkInput = ref<QInput>();
const tags = BLOG_TAG.map((v) => ({ id: v.type, name: v.type }));
const getLabel = (type: string) => BLOG_TAG.find((v) => v.type === type)?.label;
const clickTag = (tagName: string) => {
  const getUrl = (type: string) => {
    if ("TISTORY" === type) return "https://domain.tistory.com/";
    if ("VELOG" === type) return "https://velog.io/@domain/";
    if ("BRUNCH" === type) return "https://brunch.co.kr/@domain/";
    if ("MEDIUM" === type) return "https://medium.com/@domain/";
    if ("NAVER" === type) return "https://blog.naver.com/@domain/";
    if ("YOUTUBE" === type) return "https://www.youtube.com/channel/domain/";
    return "https://";
  };
  url.value = getUrl(tagName);
  linkInput.value?.focus();
};
</script>
<template>
  <q-dialog
    v-model="_show"
    position="top"
    @before-show="() => initRef()"
    class="link-dialog"
  >
    <q-card style="width: 100vw; max-width: 420px; min-width: 360px">
      <q-card-section class="q-pb-none">
        <div class="text-h6">블로그 URL 추가</div>
      </q-card-section>
      <div class="row q-pa-sm">
        <q-chip
          v-for="(tag, i) in tags"
          :key="i"
          outline
          square
          clickable
          color="dark"
          style="opacity: 0.8"
          @click="clickTag(tag.name)"
        >
          <q-avatar size="18px">
            <q-img
              :src="getImage(`platform/${tag.name.toLowerCase()}.png`)"
              :no-transition="true"
            />
          </q-avatar>
          {{ getLabel(tag.name) }}
        </q-chip>
      </div>
      <q-card-section class="q-pt-none">
        <q-input
          v-model.trim="url"
          bottom-slots
          stack-label
          placeholder="링크를 적어주세요"
          label="링크"
          autofocus
          :rules="linkRules"
          ref="linkInput"
          @update:model-value="checkUrl"
        >
          <template #hint>
            ※ 'https://'로 시작하는 블로그URL을 적어주세요
          </template>
        </q-input>
        <q-input
          v-if="isShowRssUrl"
          v-model.trim="rssUrl"
          bottom-slots
          stack-label
          placeholder="RSS링크가 필요합니다."
          label="RSS 링크"
          :rules="linkRules"
        >
          <template #hint>
            ※ 스크래핑이 어려워 rss url을 별도로 입력해주세요!
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn aria-label="saveLink" color="primary" @click="saveLink">
          추가
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style lang="scss" scoped>
.link-dialog .q-dialog__inner {
  top: 100px !important;
}
</style>
