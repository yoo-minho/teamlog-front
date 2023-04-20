<script setup lang="ts">
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { ref, watch, onMounted, onActivated } from "vue";
import { useUserStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import MainHeader from "@/components/Menu/MainHeader.vue";
import { MainTabType } from "@/types/common";

const $q = useQuasar();
const isDarkActive = ref($q.dark.isActive);
const userStore = useUserStore();
const { isExistsUser, profileImage, mainTab, mainScrollAreaRef } =
  storeToRefs(userStore);
const { handleSwipeMainTab } = userStore;
const { fetchUser } = userStore;
const route = useRoute();
const router = useRouter();

const emits = defineEmits<{
  (eventName: "pull2refresh", done: () => void): void;
}>();
const tabArr = ["Team", "Blog", "Post", "Noti", "My"];

onMounted(() => {
  fetchUser();
});

watch(
  () => $q.dark.isActive,
  (val) => (isDarkActive.value = val)
);

const _handleSwipe = (newInfo: { direction: "left" | "right" }) => {
  const mainTabType = `t_${
    tabArr.findIndex((v) => v === route.name) || 0
  }` as MainTabType;
  handleSwipeMainTab(newInfo.direction, mainTabType);
};

watch(
  () => mainTab.value,
  (mainTab) => {
    if (!mainTab) return;
    //handleSwipe
    const idx = +mainTab.replace("t_", "") % 5;
    const name = tabArr[idx] || "Team";
    router.push({ name, replace: true });
  }
);

onActivated(() => {
  mainTab.value = "t_0";
});
</script>
<template>
  <div :class="`max-width ${isDarkActive ? 'bg-grey-9' : 'bg-white'}`">
    <q-scroll-area
      ref="mainScrollAreaRef"
      class="max-width without-header"
      :visible="true"
      style="height: 100vh; overflow: hidden"
    >
      <MainHeader style="position: relative" />
      <div style="position: sticky; top: 0; z-index: 1">
        <q-tabs
          v-model="mainTab"
          class="bg-dark text-white shadow-2"
          align="justify"
        >
          <q-route-tab to="/" label="Team" style="flex: 1" no-caps />
          <q-route-tab to="/blog" label="Blog" style="flex: 1" no-caps />
          <q-route-tab to="/post" label="Post" style="flex: 1" no-caps />
          <q-route-tab
            to="/noti"
            icon="notifications"
            style="flex: 1"
            no-caps
          />
          <q-route-tab to="/my" style="flex: 1" no-caps>
            <q-btn v-if="isExistsUser" flat round>
              <q-avatar size="28px">
                <img :src="profileImage" />
              </q-avatar>
            </q-btn>
            <q-btn v-else icon="account_circle" flat round />
          </q-route-tab>
        </q-tabs>
      </div>
      <q-layout style="min-height: 0">
        <q-page-container style="min-height: 0; padding: 0">
          <q-page v-touch-swipe.mouse.left.right="_handleSwipe">
            <q-pull-to-refresh
              @refresh="(done: () => void) => emits('pull2refresh', done)"
            >
              <slot></slot>
            </q-pull-to-refresh>
          </q-page>
        </q-page-container>
        <q-page-scroller
          position="bottom-right"
          :scroll-offset="150"
          :offset="[18, 18]"
        >
          <q-btn fab icon="keyboard_arrow_up" color="green-5" />
        </q-page-scroller>
      </q-layout>
    </q-scroll-area>
  </div>
</template>
<style lang="scss">
.q-tab--active {
  color: $green-5;
}
</style>
