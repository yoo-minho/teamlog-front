<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import MainHeader from "@/components/Header/MainHeader.vue";

const $q = useQuasar();
const isDarkActive = ref($q.dark.isActive);
const userStore = useUserStore();
const { isExistsUser, user, mainScrollAreaRef } = storeToRefs(userStore);
const route = useRoute();

const tab = ref(String(route.name));
watch(
  () => $q.dark.isActive,
  (val) => (isDarkActive.value = val)
);

watch(tab, (newTab) => {
  if (newTab === null) return;
  setTimeout(async () => {
    const route = useRoute();
    if (route.name === newTab) return;
    await navigateTo(newTab);
  }, 0);
});
</script>
<template>
  <div :class="`${isDarkActive ? 'bg-grey-9' : 'bg-white'}`">
    <q-layout>
      <MainHeader style="position: relative" />
      <q-tabs
        v-model="tab"
        dense
        :class="`text-grey js-tab bg-dark`"
        :active-color="`green-3`"
        :indicator-color="`green-3`"
      >
        <q-route-tab
          name="team"
          to="/team"
          label="Team"
          no-caps
          style="flex: 1"
        />
        <q-route-tab
          name="blog"
          to="/blog"
          label="Blog"
          no-caps
          style="flex: 1"
        />
        <q-route-tab
          name="post"
          to="/post"
          label="Post"
          no-caps
          style="flex: 1"
        />
        <q-route-tab
          name="stat"
          to="/stat"
          label="Stat"
          no-caps
          style="flex: 1"
        />
        <q-route-tab name="my" to="/my" no-caps style="flex: 1">
          <q-btn v-if="isExistsUser" flat round>
            <q-avatar size="28px">
              <q-img :src="user.profileImage" />
            </q-avatar>
          </q-btn>
          <q-btn v-else icon="account_circle" flat round />
        </q-route-tab>
      </q-tabs>
      <q-tab-panels v-model="tab" animated swipeable class="my-panels">
        <q-tab-panel name="team" class="q-pa-none">
          <slot />
        </q-tab-panel>
        <q-tab-panel name="blog" class="q-pa-none">
          <slot />
        </q-tab-panel>
        <q-tab-panel name="post" class="q-pa-none">
          <slot />
        </q-tab-panel>
        <q-tab-panel name="stat" class="q-pa-none">
          <slot />
        </q-tab-panel>
        <q-tab-panel name="my" class="q-pa-none">
          <slot />
        </q-tab-panel>
      </q-tab-panels>
    </q-layout>
  </div>
</template>
<style>
.my-panels .q-panel.scroll {
  overflow: hidden;
}
</style>
