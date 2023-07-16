<script setup lang="ts">
import { inject } from "vue";
import { storeToRefs } from "pinia";
import { QSpinnerIos, useQuasar } from "quasar";
import UserApi from "@/api/userApi";
import { delay } from "@/utils/CommUtil";
import { VueCookies } from "vue-cookies";
import { useUserStore } from "@/stores/user";
import ApiArr from "@/data/login-api.json";

const $q = useQuasar();
const $cookies = inject<VueCookies>("$cookies");
const userStore = useUserStore();
const { isExistsUser, profileImage, name, email } = storeToRefs(userStore);

const tryLoginKakao = (e: MouseEvent) => {
  $q.loading.show({
    spinner: QSpinnerIos,
    spinnerColor: "white",
    spinnerSize: 140,
    backgroundColor: "dark",
    message: "잠시만 기다려주세요!",
    messageColor: "white",
  });
  window.open("/api/auth/kakao", "kakao");
  const iv = setInterval(async () => {
    if (!$cookies?.get("access-token")) return;
    $q.notify({ type: "success", message: "로그인 성공" });
    await delay(500);
    $q.loading.hide();
    location.reload();
    clearInterval(iv);
  }, 1000);
  return e;
};

const logout = async () => {
  await UserApi.logoutUser();
  location.href = "/";
};
</script>
<template>
  <div class="q-px-md q-mb-md">
    <template v-if="isExistsUser">
      <div class="row">
        <div style="width: 64px">
          <q-btn flat round dense>
            <q-avatar size="48px">
              <img :src="profileImage" />
            </q-avatar>
          </q-btn>
        </div>
        <div class="col">
          <div style="font-size: 1rem">{{ name }}</div>
          <div>{{ email || "nomail@kakao.com" }}</div>
        </div>
        <div style="width: 64px; text-align: center">
          <q-btn round icon="logout" @click="logout()"></q-btn>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="row">
        <div
          v-for="(api, i) in ApiArr.slice(0, 1)"
          :key="i"
          class="button-wrap col"
          @click="tryLoginKakao"
        >
          <div class="contents" :style="api.style">
            <img width="24" height="24" :src="api.src" :alt="api.alt" />
            <span class="label">{{ api.label }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.button-wrap {
  .contents {
    cursor: pointer;
    display: flex;
    place-content: center;
    height: 36px;
    border-color: rgba(0, 0, 0, 0);
  }

  img {
    align-self: center;
  }

  .label {
    align-self: center;
    margin-left: 20px;
    font-size: 16px;
  }
}
</style>
