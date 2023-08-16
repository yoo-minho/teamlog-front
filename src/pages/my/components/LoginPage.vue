<script setup lang="ts">
import { QSpinnerIos } from "quasar";
import ApiArr from "@/data/login-api.json";
import FeatureInfo from "./FeatureInfo.vue";

const isProd = process.env.NODE_ENV === "production";

const tryLogin = (e: MouseEvent, id: string) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase[isProd ? "prod" : "dev"];
  if (id === "kakao") {
    Loading.show({
      spinner: QSpinnerIos,
      spinnerColor: "white",
      spinnerSize: 140,
      backgroundColor: "dark",
      message: "잠시만 기다려주세요!",
      messageColor: "white",
    });
    location.href = baseURL + "auth/kakao";
    setTimeout(() => {
      Loading.hide();
    }, 1000);
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
          <span class="login-label">{{ api.label }}</span>
        </div>
      </li>
    </ul>
    <q-item-label
      class="text-weight-bolder q-mb-md text-center"
      style="font-size: 20px"
    >
      로그인하면 할 수 있는 기능들을 소개합니다
    </q-item-label>
    <FeatureInfo />
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

  .login-label {
    align-self: center;
    margin-left: 20px;
    font-size: 20px;
  }
}
</style>
