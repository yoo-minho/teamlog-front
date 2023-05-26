<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import LoginPage from "./components/LoginPage.vue";
import MyInnerPage from "./components/MyInnerPage.vue";

const userStore = useUserStore();
const { isExistsUser, user } = storeToRefs(userStore);

definePageMeta({
  pageTransition: {
    mode: "out-in",
  },
  middleware(to, from) {
    const idx = (n: string) =>
      ["team", "blog", "post", "noti", "my"].findIndex((v) => v === n);
    if (!to.meta.pageTransition || to.meta.pageTransition === true) return;
    const toIdx = idx(String(to.name));
    const fromIdx = idx(String(from.name));
    console.log(to.name, from.name, toIdx, fromIdx);
    to.meta.pageTransition.name =
      toIdx > fromIdx ? "slide-left" : "slide-right";
  },
});
</script>

<template>
  <q-page class="q-mt-sm">
    <template v-if="isExistsUser">
      <MyInnerPage
        :id="user.id"
        :name="user.name"
        :email="user.email"
        :profile-image="user.profileImage"
      />
    </template>
    <template v-else>
      <LoginPage />
    </template>
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
