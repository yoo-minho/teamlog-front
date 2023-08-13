<script setup lang="ts">
import UserApi from "@/api/userApi";
import FeatureInfo from "./FeatureInfo.vue";

const props = defineProps<{
  id: string;
  name: string;
  email?: string;
  profileImage?: string;
}>();

const logout = async () => {
  await UserApi.logoutUser(props.id);
  location.href = "/";
};
</script>

<template>
  <q-list>
    <q-item clickable>
      <q-item-section avatar top>
        <q-avatar>
          <img :src="profileImage" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label lines="1">
          <div style="font-size: 1rem">{{ name }}</div>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-icon name="edit" />
      </q-item-section>
    </q-item>
    <q-separator spaced />
    <q-item clickable dense @click="logout()">
      <q-item-section avatar top>
        <q-avatar icon="logout" />
      </q-item-section>
      <q-item-section>
        <q-item-label lines="1">로그아웃</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-icon name="navigate_next" />
      </q-item-section>
    </q-item>
    <q-separator spaced />
  </q-list>
</template>
<style lang="scss" scoped></style>
