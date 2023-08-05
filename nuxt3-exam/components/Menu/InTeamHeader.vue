<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { showBottomSheet } from "@/composables/useSnsBottomSheet";
import GroupApi from "@/api/groupApi";

const props = defineProps<{ groupId?: number; groupTitle: string }>();
const { groupId } = toRefs(props);

const userStore = useUserStore();
const { isSearchMode, searchWord, isMasterUser } = storeToRefs(userStore);
const { toggleSearchMode, initSearchData } = userStore;
const route = useRoute();
const _openSettingMain = () => navigateTo({ name: "setting" });
const isPost = ref(false);

watch(
  () => route.name,
  (rn) => {
    isPost.value = rn === "@teamId-post";
    if (!isPost.value) initSearchData();
  },
  { immediate: true }
);

const goMain = () => navigateTo({ path: "/team" }, { replace: true });
const deleteTeam = async () => {
  Dialog.create({
    title: "삭제하기",
    message: "이 팀을 삭제할까요?",
    ok: "삭제하기",
    cancel: "취소",
  }).onOk(async () => {
    await GroupApi.delete(groupId?.value);
    await new Promise((res) => setTimeout(res, 1000)); //타이밍 이슈가 있나보다.
    goMain();
  });
};
</script>

<template>
  <q-header bordered class="text-white max-width">
    <q-toolbar>
      <q-btn icon="keyboard_backspace" flat round dense @click="goMain()" />
      <template v-if="isSearchMode">
        <q-input
          v-model="searchWord"
          type="search"
          bg-color="grey-2"
          dense
          rounded
          maxlength="20"
          style="flex: 1"
          :input-style="{ fontSize: '1rem' }"
          class="super-small"
          :placeholder="`'${groupTitle}'에서 검색`"
          autofocus
        >
          <template #prepend>
            <q-icon name="search" class="q-ma-sm" />
          </template>
        </q-input>
        <q-btn icon="close" flat round dense @click="toggleSearchMode()" />
      </template>
      <template v-else>
        <q-toolbar-title class="name ellipsis">
          {{ groupTitle }}
        </q-toolbar-title>
        <q-btn
          icon="edit"
          flat
          round
          dense
          @click="navigateTo('edit', { replace: true })"
        />
      </template>
      <template v-if="isMasterUser">
        <q-btn icon="delete" flat round dense @click="deleteTeam" />
      </template>
      <q-btn icon="share" flat round dense @click="showBottomSheet()" />
      <q-btn icon="menu" flat round dense @click="_openSettingMain" />
    </q-toolbar>
  </q-header>
</template>

<style scope lang="scss">
.name {
  align-items: center;
  color: white;
  font-size: 20px;
  margin-left: 4px;
  font-weight: bold;
}

.super-small.q-field--dense {
  margin-right: 8px;

  .q-field__control {
    border-radius: 16px;
    height: 32px !important;
  }

  .q-field__marginal {
    padding: 0;
    height: 32px !important;
  }
}
</style>
