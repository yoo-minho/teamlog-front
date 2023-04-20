<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";

import { useGroupStore } from "@/stores/group";
import { useSubpageStore } from "@/stores/subpage";
import { useUserStore } from "@/stores/user";
import { showBottomSheet } from "@/hooks/useSnsBottomSheeet";
import { MAINTAB_LABEL } from "@/constants";

const groupStore = useGroupStore();
const { sortGroups } = groupStore;
const { groupSort } = storeToRefs(groupStore);

const subpageStore = useSubpageStore();
const { openSettingMain } = subpageStore;

const userStore = useUserStore();
const { mainTab, isSearchMode, searchWord } = storeToRefs(userStore);
const { toggleSearchMode } = userStore;

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const _openSettingMain = () => {
  router.push({ hash: "#Setting" });
  openSettingMain();
};
const titleByTab = computed(
  () => MAINTAB_LABEL[+mainTab.value?.replace("t_", "") % 5] || "팀로그"
);
const keywordRef = ref();
const fakeSearchWord = ref();

watch(
  () => keywordRef.value,
  (v) => {
    if (!v) return;
    const el = keywordRef.value.getNativeElement();
    el.addEventListener("input", (e: InputEvent) => {
      const eventTarget = e.target as HTMLInputElement;
      searchWord.value = eventTarget.value;
    });
  }
);

const showSortBottomSheet = () => {
  const checkedIcon = (name: string) =>
    groupSort.value === name ? "check_box" : "check_box_outline_blank";
  $q.bottomSheet({
    message: "정렬",
    grid: false,
    actions: [
      {
        label: "포스트 최신 작성순",
        id: "lastPostCreatedAt",
        icon: checkedIcon("lastPostCreatedAt"),
      },
      {
        label: "주간 게시물 많은 순",
        id: "weeklyAvgPost",
        icon: checkedIcon("weeklyAvgPost"),
      },
      {
        label: "투데이 방문자 순",
        id: "todayViews",
        icon: checkedIcon("todayViews"),
      },
      {
        label: "누적 방문자 순",
        id: "totalViews",
        icon: checkedIcon("totalViews"),
      },
    ],
  }).onOk((action) => {
    $q.localStorage.set("groupSort", action.id);
    sortGroups(action.id);
  });
};
</script>

<template>
  <q-header bordered class="text-white max-width">
    <q-toolbar>
      <q-input
        v-if="isSearchMode"
        ref="keywordRef"
        v-model="fakeSearchWord"
        type="search"
        bg-color="grey-2"
        dense
        rounded
        maxlength="20"
        :debounce="500"
        style="flex: 1"
        :input-style="{ fontSize: '1rem' }"
        class="super-small"
        :placeholder="`'${titleByTab}'에서 검색`"
        autofocus
      >
        <template #prepend>
          <q-icon name="search" class="q-ma-sm" />
        </template>
      </q-input>
      <q-toolbar-title v-else class="name">{{ titleByTab }}</q-toolbar-title>
      <q-btn
        :icon="isSearchMode ? 'close' : 'search'"
        flat
        round
        dense
        @click="toggleSearchMode()"
      />
      <q-btn
        v-if="String(route.name) === 'Team'"
        icon="sort"
        flat
        round
        dense
        @click="showSortBottomSheet()"
      />
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
  margin: 0 8px;

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
