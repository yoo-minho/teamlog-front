<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useSubpageStore } from "@/stores/subpage";
import { useUserStore } from "@/stores/user";
import { showBottomSheet } from "@/hooks/useSnsBottomSheeet";
import { useGroupStore } from "@/stores/group";

const groupStore = useGroupStore();
const { currentGroup } = storeToRefs(groupStore);

const subpageStore = useSubpageStore();
const { openSettingMain } = subpageStore;

const userStore = useUserStore();
const { isSearchMode, searchWord } = storeToRefs(userStore);

const { toggleSearchMode } = userStore;

const router = useRouter();

const _openSettingMain = () => {
  router.push({ hash: "#Setting" });
  openSettingMain();
};
</script>

<template>
  <q-header bordered class="text-white max-width">
    <q-toolbar>
      <q-btn
        icon="keyboard_backspace"
        flat
        round
        dense
        @click="router.push({ name: 'Team' })"
      />
      <q-input
        v-if="isSearchMode"
        v-model="searchWord"
        type="search"
        bg-color="grey-2"
        dense
        rounded
        maxlength="20"
        style="flex: 1"
        :input-style="{ fontSize: '1rem' }"
        class="super-small"
        :placeholder="`'123'에서 검색`"
        autofocus
      >
        <template #prepend>
          <q-icon name="search" class="q-ma-sm" />
        </template>
      </q-input>
      <q-toolbar-title class="name ellipsis">{{
        currentGroup.title
      }}</q-toolbar-title>
      <q-btn
        :icon="isSearchMode ? 'close' : 'search'"
        flat
        round
        dense
        @click="toggleSearchMode()"
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
