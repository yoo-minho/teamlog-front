<script setup lang="ts">
import { useQuasar, QSpinnerIos } from "quasar";

import { delay } from "@/util/CommUtil";
import ApiArr from "@/data/login-api.json";

const $q = useQuasar();
const logo = new URL(`../../assets/dark_logo.png`, import.meta.url).toString();

const tryLogin = (e: MouseEvent, id: string) => {
  if (id === "kakao") {
    $q.loading.show({
      spinner: QSpinnerIos,
      spinnerColor: "white",
      spinnerSize: 140,
      backgroundColor: "dark",
      message: "잠시만 기다려주세요!",
      messageColor: "white",
    });
    location.href = "http://localhost:5000/api/auth/kakao";

    // const iv = setInterval(async () => {
    //   if (!w?.closed) return;
    //   $q.loading.hide();
    //   $q.notify({ type: "success", message: "로그인 성공" });
    //   await delay(500);
    //   clearInterval(iv);
    //   location.reload();
    // }, 1000);
    return e;
  }
  return e;
};
</script>

<template>
  <q-page class="q-pa-lg">
    <ul class="q-ma-none">
      <li
        v-for="api in ApiArr.filter((api) => api.id === 'kakao')"
        :key="api.id"
        class="button-wrap"
        @click="(e:MouseEvent) => tryLogin(e, api.id)"
      >
        <div class="contents" :style="api.style">
          <img width="24" height="24" :src="api.src" :alt="api.alt" />
          <span class="label">{{ api.label }}</span>
        </div>
      </li>
    </ul>
    <q-item dense class="text-h6 q-mb-lg column items-center">
      <q-item dense>간편하게 로그인하고</q-item>
      <q-item dense>자유롭게 활용하세요</q-item>
    </q-item>
    <q-item dense class="d-flex text-center column items-center">
      <q-item dense class="q-mx-sm">Service by Teamlog</q-item>
      <q-img :src="logo" spinner-color="white" class="logo-img" />
    </q-item>
  </q-page>
</template>
<style lang="scss" scoped>
.button-wrap {
  margin-bottom: 20px;

  .contents {
    cursor: pointer;
    display: flex;
    place-content: center;
    height: 56px;
    border-radius: 10px;
  }

  img {
    align-self: center;
  }

  .label {
    align-self: center;
    margin-left: 20px;
    font-size: 1rem;
  }
}
</style>
