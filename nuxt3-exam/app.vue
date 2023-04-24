<script setup lang="ts">
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
// import { showBottomSheet } from '@/hooks/useInstallBottomSheeet';
// import { useSubpageStore } from '@/stores/subpage';
import SettingSubpage from "./components/Setting/SettingSubpage.vue";
import DataSubpage from "./components/Setting/DataSubpage.vue";
import GroupEditor from "./components/Editor/GroupEditor.vue";
import LinkEditor from "./components/Editor/LinkEditor.vue";
import { useSubpageStore } from "./stores/subpage";

const $q = useQuasar();
const isDarkActive = ref($q.dark.isActive);
const subpageStore = useSubpageStore();
const {
  isOpenGroupEditor,
  isOpenLinkEditor,
  isOpenSettingSubpage,
  isOpenDataSubpage,
} = storeToRefs(subpageStore);

watch(
  () => $q.dark.isActive,
  (val) => (isDarkActive.value = val)
);

onMounted(() => {
  if (location.pathname !== "/") return;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    // showBottomSheet(e as BeforeInstallPromptEvent);
  });
  window.addEventListener("appinstalled", () => {
    console.log("PWA was installed");
  });
});

const route = useRoute();
const teamId = ref(String(route.params.teamId || ""));
const isInTeam = computed(() => "" !== teamId.value);
watch(
  () => String(route.params.teamId || ""),
  (id) => (teamId.value = id)
);
</script>

<template>
  <div :class="`max-width ${isDarkActive ? 'bg-grey-9' : 'bg-white'}`">
    <!-- <div id="subpage">
        <GroupEditor v-if="isOpenGroupEditor" />
        <LinkEditor v-if="isOpenLinkEditor" />
        <SettingSubpage v-if="isOpenSettingSubpage" />
        <DataSubpage v-if="isOpenDataSubpage" />
      </div> -->
    <!-- <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view> -->
    <NuxtLayout :name="isInTeam ? 'in-team' : 'default'">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: "Pretendard-Regular";
  font-style: normal;
  font-weight: 400;
  src: url("@/assets/fonts/Pretendard-Regular.woff2") format("woff2"),
    url("@/assets/fonts/Pretendard-Regular.woff") format("woff"),
    url("@/assets/fonts/Pretendard-Regular.ttf") format("truetype");
}

body {
  overflow: hidden;
}

ul {
  padding: 5px;
  list-style-type: none;
}

body {
  font-family: "Pretendard-Regular", "Noto Sans KR", Avenir, Helvetica, Arial,
    sans-serif;
  color: #2c3e50;
  background-color: $grey-3;
}

.max-width {
  max-width: 460px;
  min-width: 360px;
  margin: 0 auto;
  width: 100vw;
}

.without-header {
  height: calc(100vh - 51px);
}

.margin-top-header {
  top: 51px;
}

.image-48 {
  width: 48px;
  height: 48px;
  background: black;
  color: white;
  line-height: 48px;
  text-align: center;
}

.subpage {
  position: absolute;
  z-index: 3000;
}

.logo-img {
  height: 36px;
  max-width: 36px;
}

.q-pull-to-refresh__puller-container {
  left: 0 !important;
}

.q-item__section--side {
  padding-right: 8px !important;
}

.q-separator--horizontal:last-child {
  margin-bottom: 0 !important;
}
</style>
