<script setup lang="ts">
import { ErrorMessage, Link } from "~/types/common";
import { useQuasar } from "quasar";
import { scrapOGS } from "@/composables/useOgs";

const $q = useQuasar();
const props = defineProps<{ show: boolean }>();
const emits = defineEmits<{ (eventName: "saveLink", link: Link): void }>();
const show = toRef(props, "show");
const _show = ref(false);
watch(show, (value) => {
  _show.value = value;
});

const BLOG_EXPRESSION = {
  NAVER: /https:\/\/blog.naver.com\/([0-9a-zA-Z_-]*)(\/)?([0-9a-zA-Z]*)/gi,
  TISTORY: /https:\/\/([0-9a-zA-Z_-]*)\.tistory.com(\/)?([0-9a-zA-Z]*)/gi,
  VELOG: /https:\/\/velog.io\/@([0-9a-zA-Z_-]*)(\/)?([0-9a-zA-Z]*)/gi,
  BRUNCH: /https:\/\/brunch.co.kr\/@([0-9a-zA-Z_-]*)(\/)?([0-9a-zA-Z]*)/gi,
  MEDIUM: /https:\/\/medium.com\/([0-9a-zA-Z_-]*)(\/)?([0-9a-zA-Z]*)/gi,
  YOUTUBE:
    /https:\/\/www.youtube.com\/channel\/([0-9a-zA-Z_-]*)(\/)?([0-9a-zA-Z]*)/gi,
  TWITCH: /https:\/\/www.twitch.tv\/([0-9a-zA-Z_-]*)/gi,
};

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
    $q.notify({ type: "negative", message: errMessage });
    return;
  }

  const response = await scrapOGS(url.value);
  const { error, errorMessage } = response;
  const { url: ogsUrl, type, title, description, imagePath } = response;
  if (error) {
    $q.notify({ type: "negative", message: errorMessage });
    return;
  }

  const link = {
    rssUrl: rssUrl.value,
    url: ogsUrl,
    type,
    title,
    description,
    imagePath,
  };
  emits("saveLink", link);
};
</script>
<template>
  <q-dialog v-model="_show" @before-show="() => initRef()">
    <q-card style="width: 100vw">
      <q-card-section>
        <div class="text-h6">블로그 URL 추가</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          v-model.trim="url"
          bottom-slots
          stack-label
          placeholder="링크를 적어주세요"
          label="링크"
          autofocus
          :rules="linkRules"
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
        <q-btn
          flat
          label="OK"
          color="primary"
          v-close-popup
          @click="saveLink()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped></style>
