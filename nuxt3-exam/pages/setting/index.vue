<script setup lang="ts">
import {
  openFeedbackForm,
  openServiceIdentityNotion,
  openRequestTeamMakerForm,
} from "@/composables/useOpenWindow";

import DarkModeCard from "./components/DarkModeCard.vue";
import SettingCardItem from "./components/SettingCardItem.vue";

import { openUrl } from "@/utils/CommUtil";
import { getImage } from "@/utils/ImageUtil";

import GroupApi from "@/api/groupApi";
import { BLOG_TAG } from "@/constants";

definePageMeta({
  layout: "setting",
  layoutTransition: { name: "page" },
  title: "더보기",
});

const { data } = await GroupApi.count();
const { groupCount, linkCount, postCount, linkCountByPlatform } =
  data.value || {};

const getLabel = (type: string) =>
  BLOG_TAG.find((v) => v.type === type)?.label || "All";
</script>

<template>
  <q-list padding class="rounded-borders">
    <q-item-label header>전체 카운트 통계</q-item-label>
    <div class="row q-px-md q-mb-md">
      <div class="col-4">
        <div class="text-bold text-h6">{{ groupCount?.toLocaleString() }}</div>
        팀
      </div>
      <div class="col-4">
        <div class="text-bold text-h6">{{ linkCount?.toLocaleString() }}</div>
        블로그
      </div>
      <div class="col-4">
        <div class="text-bold text-h6">{{ postCount?.toLocaleString() }}</div>
        포스트
      </div>
    </div>
    <q-separator spaced />

    <q-item-label header class="platform-area">
      전체 블로그 통계
      <q-chip size="12px" clickable @click="navigateTo('setting/platform')">
        허용가능한 블로그?
      </q-chip>
    </q-item-label>
    <div class="row q-px-md q-mb-md">
      <q-chip
        v-for="(tag, i) in linkCountByPlatform"
        :key="i"
        outline
        square
        clickable
        color="dark"
        style="opacity: 0.8"
      >
        <q-avatar size="18px">
          <q-img
            :src="getImage(`platform/${tag.type?.toLowerCase()}.png`)"
            :no-transition="true"
          />
        </q-avatar>
        {{ getLabel(tag.type) }}
        <div class="text-bold q-ml-sm">{{ tag._count }}</div>
      </q-chip>
    </div>
    <q-separator spaced />

    <q-item-label header>서비스</q-item-label>
    <SettingCardItem
      icon="grade"
      title="서비스 아이덴티티"
      @click="openServiceIdentityNotion()"
    />
    <SettingCardItem
      icon="rss_feed"
      title="팀블로그 신청하기"
      @click="openRequestTeamMakerForm()"
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

<style scope>
.count-chip {
  width: 100%;
  border-radius: 0;
}

.platform-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
}
</style>
