<script setup lang="ts">
import { storeToRefs } from "pinia";
import { QSelect, useQuasar } from "quasar";
import { useUserStore } from "@/stores/user";

import LinkCard from "@/components/Card/LinkCard.vue";
import LinkDialog from "./components/LinkDialog.vue";
import GroupApi from "@/api/groupApi";
import { Link } from "~/types/common";
import { scrapOGS } from "@/composables/useOgs";

const { atk } = storeToRefs(useUserStore());

type SelectedTag =
  | string
  | {
      label: string;
      value: number;
    };

definePageMeta({
  title: "팀 만들기",
  middleware: ["auth"],
});

const $q = useQuasar();
const router = useRouter();

const { data: tags } = await GroupApi.findAllTag();

const showLink = ref(false);
const title = ref("");
const idRef = ref();
const id = ref("");
const description = ref("");
const selectedTags = ref([] as SelectedTag[]);
const links = ref([] as Link[]);
const linksCountLabel = computed(() =>
  links.value.length > 0 ? `(${links.value.length}/10)` : ""
);

const titleRules = [
  (val: string) => val?.length > 0 || "팀 이름을 입력해주세요!",
];
const idRules = [
  (val: string) => val?.length > 0 || "도메인을 입력해주세요!",
  (val: string) =>
    new RegExp(/^[A-Za-z0-9_+]*$/).test(val) ||
    "대소문자, 숫자, 언더바를 활용하여 입력해주세요!",
];

const options =
  tags.value?.map((tag) => ({
    label: tag.name,
    value: tag.id,
  })) || [];

const saveLink = (link: Link) => links.value.push(link);
const deleteLink = (url: string) => {
  links.value = links.value.filter((link) => link.url !== url);
};
const refreshLink = async (url: string, stopLoading: () => void) => {
  const { error, title, description, imagePath } = await scrapOGS(url);
  stopLoading();
  if (error) return;
  links.value = links.value.map((link) =>
    link.url === url ? { ...link, title, description, imagePath } : link
  );
};
const saveGroup = async () => {
  // await UserApi.reissueTest();
  const domain = id.value;
  if (!domain || domain.length === 0) {
    $q.notify({ type: "negative", message: "도메인을 입력해주세요!" });
    idRef.value.focus();
    return;
  }
  if (!links.value || links.value.length === 0) {
    $q.notify({ type: "negative", message: "최소 1개의 url이 필요합니다." });
    return;
  }
  GroupApi.create({
    domain,
    title: title.value,
    description: description.value,
    tags: selectedTags.value.map((tag) =>
      typeof tag === "string" ? tag : tag.label
    ),
    links: links.value,
  }).then(() => {
    router.push({ path: `/@${domain}` });
  });
};
</script>
<template>
  <div>
    <NuxtLayout name="new" @save="saveGroup()">
      <LinkDialog
        :show="showLink"
        @hide="showLink = false"
        @save-link="saveLink"
      />
      {{ atk }}
      <q-input
        v-model="title"
        placeholder="팀 이름 추가"
        label="팀 이름"
        counter
        maxlength="20"
        stack-label
        autofocus
        hide-bottom-space
        :rules="titleRules"
      />
      <q-input
        ref="idRef"
        v-model="id"
        label="전용 링크"
        type="email"
        stack-label
        counter
        maxlength="20"
        placeholder="전용 링크 추가"
        prefix="https://teamlog.team/@"
        :rules="idRules"
      />
      <q-input
        v-model="description"
        stack-label
        autogrow
        clearable
        counter
        maxlength="100"
        type="textarea"
        label="팀 설명"
        placeholder="(선택) 팀 설명을 적어주세요!"
        hide-bottom-space
      />
      <q-select
        v-model="selectedTags"
        stack-label
        label="태그 추가"
        use-input
        use-chips
        multiple
        input-debounce="0"
        :options="options"
        new-value-mode="add-unique"
      />
      <q-btn
        color="primary"
        class="full-width"
        label="블로그 링크 추가"
        @click="showLink = true"
      >
        <span class="q-ml-sm">{{ linksCountLabel }}</span>
      </q-btn>
      <q-list v-if="links.length > 0" bordered separator class="full-width">
        <div v-for="(link, i) in links" :key="i" :data-key="link.id">
          <LinkCard
            :link="link"
            icon-name="clear"
            @click-icon="() => deleteLink(link.url)"
            @refresh-icon="(stopLoading) => refreshLink(link.url, stopLoading)"
          />
        </div>
      </q-list>
    </NuxtLayout>
  </div>
</template>
