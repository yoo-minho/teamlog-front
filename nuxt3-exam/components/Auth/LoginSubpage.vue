<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue";
import { useSubpageStore } from "@/stores/subpage";
import ApiArr from "@/data/login-api.json";

const subpageStore = useSubpageStore();
const { closeLoginSubpage } = subpageStore;

const logo = new URL(`@/assets/dark_logo.png`, import.meta.url).toString();

const tryLoginKakao = (e: MouseEvent) => {
  location.href = "/api/auth/kakao";
  // $q.notify({ type: 'info', message: '준비중입니다!' });
  return e;
  // Kakao.Auth.authorize({
  //   redirectUri: '/oauth',
  // });
};
</script>
<template>
  <AuthLayout title="로그인" @close="closeLoginSubpage()">
    <q-page class="q-pa-lg">
      <ul class="q-ma-none">
        <li
          v-for="(api, i) in ApiArr"
          :key="i"
          class="button-wrap"
          @click="tryLoginKakao"
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
  </AuthLayout>
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
