<script setup lang="ts">
import GroupApi from "@/api/groupApi";
import TeamForm from "@/components/Form/TeamForm.vue";
import { TeamFormType } from "types/common";

definePageMeta({
  title: "팀 만들기",
  layout: "empty",
  middleware: ["auth"],
});

const saveTeam = async (formData: TeamFormType) => {
  const { error } = await GroupApi.create(formData);
  if (error.value?.statusCode === 409) {
    Notify.create({ type: "negative", message: "중복된 도메인이 존재합니다!" });
    return;
  }
  Notify.create({ type: "success", message: "등록되었습니다." });
  await new Promise((res) => setTimeout(res, 500)); //타이밍 이슈가 있나보다.
  await navigateTo(`/@${formData.domain}/post`, { replace: true });
};
</script>
<template>
  <TeamForm @submit="saveTeam" />
</template>
