<script setup lang="ts">
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import MainHeader from "@/components/Menu/MainHeader.vue";

const $q = useQuasar();
const isDarkActive = ref($q.dark.isActive);
const userStore = useUserStore();
const { isExistsUser, user, mainScrollAreaRef } = storeToRefs(userStore);
const [route] = [useRoute(), useRouter()];

const tab = ref(String(route.name));
watch(
  () => $q.dark.isActive,
  (val) => (isDarkActive.value = val)
);
watch(
  () => route.name,
  () => {
    // mainScrollAreaRef.value.setScrollPosition("vertical", 0, 0);
  }
);
</script>
<template>
  <q-layout>
    <div :class="`${isDarkActive ? 'bg-grey-9' : 'bg-white'}`">
      <q-scroll-area
        ref="mainScrollAreaRef"
        class="without-header"
        :visible="true"
        style="height: 100vh; overflow: hidden"
      >
        <MainHeader style="position: relative" />
        <div style="position: sticky; top: 0; z-index: 1">
          <q-tabs
            v-model="tab"
            class="bg-dark text-white shadow-2"
            align="justify"
          >
            <q-route-tab to="/team" label="Team" style="flex: 1" no-caps />
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
                  <img :src="user.profileImage" />
                </q-avatar>
              </q-btn>
              <q-btn v-else icon="account_circle" flat round />
            </q-route-tab>
          </q-tabs>
        </div>
        <q-layout style="min-height: 0" class="max-width">
          <q-page-container style="min-height: 0; padding: 0">
            <q-page style="min-height: 0">
              <slot />
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
  </q-layout>
</template>
<style lang="scss">
.q-tab--active {
  color: $green-5;
}
</style>
