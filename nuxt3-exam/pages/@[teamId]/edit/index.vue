<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import GroupApi from "@/api/groupApi";
import TeamForm from "@/components/Form/TeamForm.vue";
import { TeamFormType } from "types/common";

const $q = useQuasar();

definePageMeta({
  title: "팀 수정하기",
  layout: "empty",
  middleware: ["auth"],
});

const groupStore = useGroupStore();
const { currentGroup } = storeToRefs(groupStore);
const editTeam = async (formData: TeamFormType) => {
  await GroupApi.update(formData);
  $q.notify({ type: "success", message: "수정되었습니다." });
  await new Promise((res) => setTimeout(res, 500)); //타이밍 이슈가 있나보다.
  await navigateTo(`/@${formData.domain}/post`, { replace: true });
};
</script>
<template>
  <TeamForm :current-group="currentGroup" @submit="editTeam" />
</template>
