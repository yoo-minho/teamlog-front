<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { savePrompt } from "@/composables/useInstallBottomSheet";
import UserApi from "@/api/userApi";
import GroupApi from "@/api/groupApi";

const $q = useQuasar();
const isDarkActive = ref($q.dark.isActive);
const userStore = useUserStore();
const { user, atk, tags, isExistsPwaPrompt } = storeToRefs(userStore);
const route = useRoute();
const code = String(route.query.code || "");

if (!code) {
  const { data } = await UserApi.reissue();
  const rtk = useCookie("refresh-token");
  rtk.value = data.value?.rtk || "";
  atk.value = data.value?.atk || "";
} else {
  atk.value = code;
  navigateTo("my", { replace: true });
}

const { data: _user } = await UserApi.findUser(atk.value);
if (_user.value != null) {
  user.value = _user.value;
}

const { data: _tags } = await GroupApi.findAllTag();
watch(_tags, () => (tags.value = _tags.value || []), { immediate: true });

watch(
  () => $q.dark.isActive,
  (val) => (isDarkActive.value = val)
);

onMounted(() => {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    savePrompt(e);
    isExistsPwaPrompt.value = true;
    console.log("beforeinstallprompt");
  });
});
</script>
<template>
  <div :class="`max-width ${isDarkActive ? 'bg-grey-9' : 'bg-white'}`">
    <VitePwaManifest />
    <SeoKit />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 1;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
}
.pwa-toast .message {
  margin-bottom: 8px;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>

<style lang="scss">
@font-face {
  font-family: "Pretendard-Regular";
  font-style: normal;
  font-weight: 400;
  src: url("/assets/fonts/Pretendard-Regular.woff2") format("woff2"),
    url("/assets/fonts/Pretendard-Regular.woff") format("woff"),
    url("/assets/fonts/Pretendard-Regular.ttf") format("truetype");
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
  background-color: $grey-4;
}

h1,
h2,
h3 {
  font-size: 20px;
  font-weight: 900;
  line-height: 24px;
  margin: 0;
  display: inline-block;
}

h4 {
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  margin: 0;
  display: inline-block;
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
.q-item__section--side {
  padding-right: 8px !important;
}

.q-separator--horizontal:last-child {
  margin-bottom: 0 !important;
}
</style>
