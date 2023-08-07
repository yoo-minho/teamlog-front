<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTeamStore } from "@/stores/team";
import GroupApi from "@/api/groupApi";
import TeamForm from "@/components/Form/TeamForm.vue";
import { TeamFormType } from "types/common";

definePageMeta({
  title: "팀 수정하기",
  layout: "empty",
  middleware: ["auth"],
});

const teamStore = useTeamStore();
const { currentTeam } = storeToRefs(teamStore);
const editTeam = async (formData: TeamFormType) => {
  const { error } = await GroupApi.update(formData);
  console.log("error", error.value);
  if (error.value?.statusCode === 401) {
    Notify.create({
      type: "negative",
      message: "본인이 등록한 팀에 한하여 수정 가능합니다!",
    });
    return;
  }

  Notify.create({ type: "success", message: "수정되었습니다." });
  await new Promise((res) => setTimeout(res, 500)); //타이밍 이슈가 있나보다.
  await navigateTo(`/@${formData.domain}/post`, { replace: true });
};
</script>
<template>
  <TeamForm :current-team="currentTeam" @submit="editTeam" />
</template>
