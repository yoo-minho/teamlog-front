<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { TAB_LABEL } from "@/constants";
import { showBottomSheet } from "@/composables/useSnsBottomSheet";
import { showInstallBottomSheet } from "@/composables/useInstallBottomSheet";
import {
  mainSeoDesc,
  mainSeoTitle,
  tagPostSeoDesc,
  tagPostSeoTitle,
} from "@/constants/seo";

const userStore = useUserStore();
const { isExistsPwaPrompt } = storeToRefs(userStore);
const route = useRoute();
const _openSettingMain = () => navigateTo({ name: "setting" });

const _clickNoti = () => {
  Notify.create({
    type: "success",
    message: "알림 기능을 준비중입니다!",
  });
};

const routeName = ref(String(route.name || "team"));
const title = ref(TAB_LABEL[routeName.value] || "팀로그");

watch(
  () => route.name,
  (_routeName) => {
    routeName.value = String(_routeName || "team");
    title.value = TAB_LABEL[routeName.value] || "팀로그";
  }
);

const postTag = String(route.query.tag || "");
const isTagPost = postTag !== "" && postTag !== "All";
const seoTitle = isTagPost
  ? tagPostSeoTitle(routeName.value, postTag)
  : mainSeoTitle(routeName.value);
const seoDesc = isTagPost ? tagPostSeoDesc(routeName.value) : mainSeoDesc();
</script>
<template>
  <q-header bordered class="max-width">
    <q-toolbar>
      <q-toolbar-title class="name">
        <h1>{{ title }}</h1>
      </q-toolbar-title>
      <q-btn
        area-label="shareBottomSheet"
        icon="share"
        flat
        round
        dense
        @click="showBottomSheet({ seoTitle, seoDesc })"
      />
      <q-btn
        area-label="clickNoti"
        icon="notifications"
        flat
        round
        dense
        @click="_clickNoti()"
      />
      <q-btn
        area-laabel="openSettingMain"
        icon="menu"
        flat
        round
        dense
        @click="_openSettingMain"
      />
      <q-btn
        v-if="isExistsPwaPrompt"
        area-label="installBottomSheet"
        icon="add_to_home_screen"
        flat
        round
        dense
        color="green-3 bounce"
        @click="showInstallBottomSheet()"
      />
    </q-toolbar>
  </q-header>
</template>

<style scope lang="scss">
.name {
  align-items: center;
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

.bounce {
  animation: motion 0.3s linear 0s infinite alternate;
  margin-top: 0;
}

@keyframes motion {
  0% {
    margin-top: -5px;
  }
  100% {
    margin-top: 5px;
  }
}
</style>
