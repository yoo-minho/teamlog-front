<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import LoginPage from "./components/LoginPage.vue";
import MyInnerPage from "./components/MyInnerPage.vue";

const userStore = useUserStore();
const { isExistsUser, user } = storeToRefs(userStore);
</script>

<template>
  <q-page class="q-mt-sm">
    <template v-if="isExistsUser">
      <MyInnerPage
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
