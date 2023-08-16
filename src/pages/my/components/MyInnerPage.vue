<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import UserApi from "@/api/userApi";

const userStore = useUserStore();
const { isExistsUser } = storeToRefs(userStore);

const props = defineProps<{
  id: string;
  name: string;
  email?: string;
  profileImage?: string;
}>();

const logout = async () => {
  Dialog.create({
    title: "로그아웃 요청",
    message: "로그아웃할까요?",
    ok: "로그아웃",
    cancel: "취소",
  }).onOk(async () => {
    await UserApi.logoutUser(props.id);
    location.href = "/my";
  });
};

const openNewTeam = () => {
  if (isExistsUser.value) {
    navigateTo({ path: "/new/team" });
    return;
  }
  showAuthDialog({ to: "/new/team" });
};

const moveMyTeamBlog = () => {
  navigateTo({ path: "/team", query: { tag: "내가만든" } });
};
</script>

<template>
  <q-list>
    <q-item class="q-my-sm">
      <q-item-section avatar top>
        <q-avatar>
          <q-img :src="profileImage" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label lines="1" class="text-subtitle1">
          {{ name }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item clickable dense @click="logout()">
          <q-item-section side>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>로그아웃</q-item-label>
          </q-item-section>
        </q-item>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn
          align="around"
          color="green-4"
          label="팀 블로그 만들기"
          @click="openNewTeam()"
        />
      </q-item-section>
      <q-item-section>
        <q-btn
          align="around"
          outline
          color="gray-1"
          label="내가 만든 팀 블로그"
          @click="moveMyTeamBlog()"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>
<style lang="scss" scoped></style>
