<script setup lang="ts">
import { computed, onMounted, Ref, ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { QSelect, useQuasar } from 'quasar';

import { useGroupStore } from '@/stores/group';
import { useSubpageStore } from '@/stores/subpage';
import { useTagStore } from '@/stores/tag';

import EditorLayout from '@/layouts/EditorLayout.vue';
import LinkCard from '@/components/Card/LinkCard.vue';

const router = useRouter();

const groupStore = useGroupStore();
const { save, fix, deleteLink, initLinks, refreshLink, refreshGroup } = groupStore;
const { currentGroup, linksOnEditor, linkCountMessage } = storeToRefs(groupStore);

const tagStore = useTagStore();
const { tags } = storeToRefs(tagStore);

const subpageStore = useSubpageStore();
const { openLinkEditor, closeGroupEditor } = subpageStore;

const groupId = ref(0);
const isFix = computed(() => !!(groupId.value && +groupId.value > 0));

const headTitle = ref('');
const title = ref('');
const id = ref('');
const description = ref('');

const idRef = ref();
const selectRef = ref();

const $q = useQuasar();
const titleRules = [(val: string) => val?.length > 0 || '팀 이름을 입력해주세요!'];
const idRules = [
  (val: string) => val?.length > 0 || '도메인을 입력해주세요!',
  (val: string) => new RegExp(/^[A-Za-z0-9_+]*$/).test(val) || '대소문자, 숫자, 언더바를 활용하여 입력해주세요!',
];

const options = ref(tags.value);
const tag = ref('');
const selectedTags = ref([]) as Ref<string[]>;

onMounted(() => {
  const {
    title: groupTitle,
    id: _groupId,
    domain,
    description: groupDescription,
    tags: groupTags,
    links: groupLinks = [],
  } = toRaw(currentGroup.value);
  groupId.value = _groupId || 0;
  title.value = groupTitle;
  id.value = domain;
  description.value = groupDescription || '';
  selectedTags.value = groupTags?.map(({ tag }) => tag.name) || [];
  initLinks(groupLinks.map((v) => v.link));
  headTitle.value = isFix.value ? '팀 수정하기' : '팀 만들기';
});

type doneFn = (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void;

function filterFn(val: string, update: doneFn) {
  // const filterVal = tags.value.filter((name: string) => name.includes(val.toLowerCase()));
  // update(() => {
  //   options.value = filterVal.length > 0 ? filterVal : val === '' ? [] : [val];
  // });
}

function selectOption() {
  if ((tag.value || '') === '') {
    $q.notify({ type: 'negative', message: '태그를 입력해주세요.' });
    selectRef.value.focus();
    return;
  }
  if (selectedTags.value.includes(tag.value)) {
    $q.notify({ type: 'negative', message: '중복되는 태그가 존재합니다.' });
    selectRef.value.focus();
    tag.value = '';
    return;
  }
  selectedTags.value.push(tag.value);
  tag.value = '';
}

async function saveGroup() {
  const domain = id.value;
  if (!domain || domain.length === 0) {
    $q.notify({ type: 'negative', message: '도메인을 입력해주세요!' });
    idRef.value.focus();
    return;
  }
  if (!linksOnEditor.value || linksOnEditor.value.length === 0) {
    $q.notify({ type: 'negative', message: '최소 1개의 url이 필요합니다.' });
    return;
  }

  if (isFix.value) {
    await fix(groupId.value, title.value, domain, description.value, selectedTags.value);
    await refreshGroup(domain);
    _closeGroupEditor();
  } else {
    await save(title.value, domain, description.value, selectedTags.value);
    router.push({ path: `/@${domain}` });
  }
}

function _closeGroupEditor() {
  router.replace({ hash: '' });
  closeGroupEditor();
}
</script>

<template>
  <EditorLayout :title="headTitle" @save="saveGroup" @close="_closeGroupEditor">
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
      ref="selectRef"
      v-model="tag"
      stack-label
      label="태그 추가"
      use-input
      input-debounce="0"
      maxlength="10"
      counter
      :options="options"
      @filter="filterFn"
      @update:model-value="selectOption"
    >
      <template #no-option>
        <q-item>
          <q-item-section class="text-grey"> If you are writing in Korean, please hit enter </q-item-section>
        </q-item>
      </template>
    </q-select>

    <div class="row">
      <q-chip v-for="(v, i) in selectedTags" :key="i" dense>
        {{ v }}
        <q-icon class="cursor-pointer" name="clear" size="1em" @click="() => selectedTags.splice(i, 1)" />
      </q-chip>
    </div>

    <q-btn color="primary" class="full-width" label="블로그 링크 추가" @click="openLinkEditor()">
      <span class="q-ml-sm">{{ linkCountMessage }}</span>
    </q-btn>

    <q-list v-if="linksOnEditor.length > 0" bordered separator class="full-width">
      <div v-for="(v, i) in linksOnEditor" :key="i" :data-key="v.id">
        <LinkCard
          :link="v"
          icon-name="clear"
          @click-icon="deleteLink(isFix ? 'EDIT' : 'ADD', v.id || i)"
          @refresh-icon="refreshLink(v.id, v.url)"
        />
      </div>
    </q-list>
  </EditorLayout>
</template>

<style></style>
