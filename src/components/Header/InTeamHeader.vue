<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { showBottomSheet } from "@/composables/useSnsBottomSheet";
import GroupApi from "@/api/groupApi";

const props = defineProps<{
  teamId?: number;
  teamTitle?: string;
  createrId?: string;
}>();
const { teamId } = toRefs(props);

const userStore = useUserStore();
const { isExistsUser } = storeToRefs(userStore);
const { initSearchData, isMyContents } = userStore;
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
    const { error } = await GroupApi.delete(teamId?.value);
    console.log(error.value);
    if (error.value?.statusCode === 401) {
      Notify.create({
        type: "negative",
        message: "본인이 등록한 팀에 한하여 삭제 가능합니다!",
      });
      return;
    }
    Notify.create({ type: "success", message: "삭제되었습니다." });
    await new Promise((res) => setTimeout(res, 1000)); //타이밍 이슈가 있나보다.
    goMain();
  });
};
const _openEditor = () => {
  if (isExistsUser.value) {
    navigateTo("edit", { replace: true });
    return;
  }
  showAuthDialog({ to: "edit" });
};
</script>

<template>
  <q-header bordered class="text-white max-width" style="position: relative">
    <q-toolbar>
      <q-btn icon="keyboard_backspace" flat round dense @click="goMain()" />
      <q-toolbar-title class="name ellipsis">
        <!-- {{ groupTitle }} -->
      </q-toolbar-title>
      <template v-if="isMyContents(createrId)">
        <q-btn icon="edit" flat round dense @click="_openEditor" />
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
