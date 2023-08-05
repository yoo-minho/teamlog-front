<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import MainHeader from "@/components/Menu/MainHeader.vue";

const $q = useQuasar();
const isDarkActive = ref($q.dark.isActive);
const userStore = useUserStore();
const { isExistsUser, user, mainScrollAreaRef } = storeToRefs(userStore);
const route = useRoute();
const _teamScrollVPos = useState<number>("teamScrollVPos");

const tab = ref(String(route.name));
watch(
  () => $q.dark.isActive,
  (val) => (isDarkActive.value = val)
);

watch(
  () => route.name,
  (currentRouteName) => {
    const scrollVPos = "team" === currentRouteName ? _teamScrollVPos.value : 0;
    setTimeout(() => {
      mainScrollAreaRef.value.setScrollPosition("vertical", scrollVPos, 0);
    }, 100); //0.1s의 트랜지션때문에 그보다 큰!
  }
);

const scroll = (info: any) => {
  if ("team" === String(route.name)) {
    _teamScrollVPos.value = info.verticalPosition;
  }
};
</script>
<template>
  <div :class="`${isDarkActive ? 'bg-grey-9' : 'bg-white'}`">
    <q-layout>
      <MainHeader style="position: relative" />
      <q-tabs v-model="tab" class="bg-dark text-white shadow-2" align="justify">
        <q-route-tab to="/team" label="Team" style="flex: 1" no-caps />
        <q-route-tab to="/blog" label="Blog" style="flex: 1" no-caps />
        <q-route-tab to="/post" label="Post" style="flex: 1" no-caps />
        <q-route-tab to="/noti" icon="notifications" style="flex: 1" no-caps />
        <q-route-tab to="/my" style="flex: 1" no-caps>
          <q-btn v-if="isExistsUser" flat round>
            <q-avatar size="28px">
              <q-img :src="user.profileImage" />
            </q-avatar>
          </q-btn>
          <q-btn v-else icon="account_circle" flat round />
        </q-route-tab>
      </q-tabs>
      <q-scroll-area
        @scroll="scroll"
        ref="mainScrollAreaRef"
        :visible="false"
        style="height: calc(100vh - 100px); overflow: hidden"
      >
        <q-layout class="max-width">
          <q-page-container style="min-height: 0; padding: 0">
            <q-page style="min-height: 0">
              <slot />
              <q-page-scroller
                position="bottom-right"
                :scroll-offset="150"
                :offset="[18, 18]"
              >
                <q-btn fab icon="keyboard_arrow_up" color="green-5" />
              </q-page-scroller>
            </q-page>
          </q-page-container>
        </q-layout>
      </q-scroll-area>
    </q-layout>
  </div>
</template>
<style lang="scss">
.q-tab--active {
  color: $green-5;
}
</style>
