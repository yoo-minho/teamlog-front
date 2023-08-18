<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import MainHeader from "@/components/Header/MainHeader.vue";
import { getNextTab } from "@/composables/useRouteTabSwipe";

const $q = useQuasar();
const isDarkActive = ref($q.dark.isActive);
const userStore = useUserStore();
const { isExistsUser, user } = storeToRefs(userStore);
const route = useRoute();
const tab = ref(String(route.name || ""));

watch(
  () => $q.dark.isActive,
  (val) => (isDarkActive.value = val)
);

const handleSwipe = async (v: any) => {
  const newTab = getNextTab(v, ["team", "blog", "post", "stat", "my"]);
  if (!newTab) return;
  await navigateTo(newTab, { replace: true });
  tab.value = newTab;
};

const title = `팀로그 | 보기 좋은 팀 블로그 플랫폼`;
const desc = "마음에 드는 블로그 모았더니 팀이 되어버렸네!";
useHead({
  title,
  meta: [
    { property: "description", content: desc },
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://teamlog.team/${tab.value}` },
    { property: "og:locale", content: "ko_KR" },
    { property: "og:image", content: "https://teamlog.team/og2.png" },
  ],
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
          :replace="true"
          no-caps
          style="flex: 1"
        />
        <q-route-tab
          name="blog"
          to="/blog"
          label="Blog"
          :replace="true"
          no-caps
          style="flex: 1"
        />
        <q-route-tab
          name="post"
          to="/post"
          label="Post"
          :replace="true"
          no-caps
          style="flex: 1"
        />
        <q-route-tab
          name="stat"
          to="/stat"
          label="Stat"
          :replace="true"
          no-caps
          style="flex: 1"
        />
        <q-route-tab name="my" to="/my" :replace="true" style="flex: 1">
          <q-btn v-if="isExistsUser" flat round>
            <q-avatar size="28px">
              <q-img :src="user.profileImage" />
            </q-avatar>
          </q-btn>
          <q-btn v-else icon="account_circle" flat round />
        </q-route-tab>
      </q-tabs>
      <q-tab-panels
        v-model="tab"
        animated
        class="my-panels"
        v-touch-swipe.mouse.horizontal="handleSwipe"
      >
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
<style scoped>
.my-panels .q-panel.scroll {
  overflow: hidden;
}
</style>
