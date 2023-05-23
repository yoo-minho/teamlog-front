<script setup lang="ts">
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
// import { showBottomSheet } from '@/hooks/useInstallBottomSheeet';
import { useUserStore } from "./stores/user";
import UserApi from "@/api/userApi";

const $q = useQuasar();
const isDarkActive = ref($q.dark.isActive);

const userStore = useUserStore();
const [route, router] = [useRoute(), useRouter()];
const teamId = ref(String(route.params.teamId || ""));
const isInTeam = computed(() => "" !== teamId.value);
const isSetting = computed(() => route.name?.toString().includes("setting"));

const { user } = storeToRefs(userStore);
const atk = ref("");

const code = String(route.query.code || "");
if (!code) {
  const { data } = await UserApi.reissue();
  atk.value = data.value?.atk || "";
} else {
  atk.value = code;
  router.replace("my");
}

const { data: _user } = await UserApi.findUser(atk);
if (_user.value != null) {
  user.value = _user.value;
}

watch(
  () => $q.dark.isActive,
  (val) => (isDarkActive.value = val)
);

watch(
  () => String(route.params.teamId || ""),
  (id) => (teamId.value = id)
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
</script>

<template>
  <div :class="`max-width ${isDarkActive ? 'bg-grey-9' : 'bg-white'}`">
    <template v-if="isSetting">
      <NuxtLayout name="setting">
        <NuxtPage />
      </NuxtLayout>
    </template>
    <template v-else-if="isInTeam">
      <NuxtLayout name="in-team">
        <NuxtPage />
      </NuxtLayout>
    </template>
    <template v-else>
      <NuxtLayout name="default">
        <NuxtPage />
      </NuxtLayout>
    </template>
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
.without-header.in-team {
  height: 100vh;
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
