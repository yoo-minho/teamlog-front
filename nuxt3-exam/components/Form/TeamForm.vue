<script setup lang="ts">
import { storeToRefs } from "pinia";
import { QSelect, useQuasar } from "quasar";
import { useGroupStore } from "@/stores/group";

import LinkCard from "@/components/Card/LinkCard.vue";
import LinkDialog from "@/components/Dialog/LinkDialog.vue";
import GroupApi from "@/api/groupApi";
import { Link, TeamFormType } from "@/types/common";
import { scrapOGS } from "@/composables/useOgs";

const props = defineProps<{ currentGroup: Group }>();
const emits = defineEmits<{
  (eventName: "submit", value: TeamFormType): Promise<any>;
}>();
const { currentGroup } = toRefs(props);
const {
  id = "",
  title = "",
  domain = "",
  description = "",
  tags = [],
} = currentGroup.value || {};

const $q = useQuasar();
const groupStore = useGroupStore();
const { data: allTags } = await GroupApi.findAllTag();

const showLink = ref(false);
const domainRef = ref();
const _domain = ref(domain);
const _title = ref(title);
const _description = ref(description);
const _selectedTags = ref(
  tags?.map(({ tag: { id, name } }) => ({
    label: name,
    value: id,
  })) || []
);
const _tags = computed(() => _selectedTags.value.map((tag) => tag.label));
const links = ref(currentGroup.value?.links?.map((l) => l.link) || []);
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
  allTags.value?.map((tag) => ({
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
const submitForm = async () => {
  if ((_domain.value || "").length === 0) {
    $q.notify({ type: "negative", message: "도메인을 입력해주세요!" });
    domainRef.value?.focus();
    return;
  }
  if (!links.value || links.value.length === 0) {
    $q.notify({ type: "negative", message: "최소 1개의 url이 필요합니다." });
    return;
  }
  const submitData = {
    id,
    domain: _domain.value,
    title: _title.value,
    description: _description.value,
    tags: _tags,
    links: links.value,
  };
  const x = await emits("submit", submitData);
  console.log({ x });
};
</script>
<template>
  <NuxtLayout name="new" @save="() => submitForm()">
    <q-input
      v-model="_title"
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
      v-model="_domain"
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
      v-model="_description"
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
      v-model="_selectedTags"
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
    <LinkDialog
      :show="showLink"
      @hide="showLink = false"
      @save-link="saveLink"
    />
  </NuxtLayout>
</template>
