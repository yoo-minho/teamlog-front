<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { TAB_LABEL } from "@/constants";
import { showBottomSheet } from "@/composables/useSnsBottomSheet";
import { showInstallBottomSheet } from "@/composables/useInstallBottomSheet";
import { showAuthDialog } from "@/composables/useAuthDialog";

const userStore = useUserStore();
const { isExistsUser } = storeToRefs(userStore);
const route = useRoute();
const _openSettingMain = () => navigateTo({ name: "setting" });
const _openNewTeam = () => {
  if (isExistsUser.value) {
    navigateTo({ path: "/new/team" });
    return;
  }
  showAuthDialog({ to: "/new/team" });
};

const _clickNoti = () => {
  Notify.create({
    type: "success",
    message: "알림 기능을 준비중입니다!",
  });
};

const routeName = String(route.name || "team");
const title = ref(TAB_LABEL[routeName] || "팀로그");

watch(
  () => route.name,
  (_routeName) => {
    const routeName = String(_routeName || "team");
    title.value = TAB_LABEL[routeName] || "팀로그";
  }
);
</script>
<template>
  <q-header bordered class="max-width">
    <q-toolbar>
      <q-toolbar-title class="name">{{ title }}</q-toolbar-title>
      <template v-if="routeName === 'team'">
        <q-btn icon="add" flat round dense @click="_openNewTeam()" />
      </template>
      <q-btn icon="share" flat round dense @click="showBottomSheet()" />
      <q-btn icon="notifications" flat round dense @click="_clickNoti()" />
      <q-btn icon="menu" flat round dense @click="_openSettingMain" />
      <q-btn
        icon="add_to_home_screen"
        flat
        round
        dense
        color="green-10 bounce"
        @click="showInstallBottomSheet()"
      />
    </q-toolbar>
  </q-header>
</template>

<style scope lang="scss">
.name {
  align-items: center;
  font-size: 20px;
  margin-left: 4px;
  font-weight: bold;
}

.super-small.q-field--dense {
  margin: 0 8px;

  .q-field__control {
    border-radius: 16px;
    height: 32px !important;
  }

  .q-field__marginal {
    padding: 0;
    height: 32px !important;
  }
}

.bounce {
  animation: motion 0.3s linear 0s infinite alternate;
  margin-top: 0;
}

@keyframes motion {
  0% {
    margin-top: -5px;
  }
  100% {
    margin-top: 5px;
  }
}
</style>