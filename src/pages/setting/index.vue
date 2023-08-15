<script setup lang="ts">
import {
  openFeedbackForm,
  openServiceIdentityNotion,
} from "@/composables/useOpenWindow";
import DarkModeCard from "./components/DarkModeCard.vue";
import SettingCardItem from "./components/SettingCardItem.vue";
import { openUrl } from "@/utils/CommUtil";

definePageMeta({
  layout: "setting",
  title: "더보기",
});
</script>

<template>
  <q-list padding class="rounded-borders">
    <q-item-label header>서비스</q-item-label>
    <SettingCardItem
      icon="grade"
      title="서비스 아이덴티티"
      @click="openServiceIdentityNotion()"
    />
    <SettingCardItem
      icon="reviews"
      title="의견,오류,제휴,광고 문의"
      @click="openFeedbackForm()"
    />
    <DarkModeCard />
    <q-separator spaced />

    <q-item-label header>스토리</q-item-label>
    <SettingCardItem
      icon="flag"
      title="팀로그 탄생 비화"
      @click="openUrl('https://velog.io/@dellose/teamlog-birth', 'birth')"
    />
    <SettingCardItem
      icon="military_tech"
      title="팀로그의 기술 스택"
      @click="navigateTo('/setting/stack')"
    />
  </q-list>
</template>
<style scope></style>
