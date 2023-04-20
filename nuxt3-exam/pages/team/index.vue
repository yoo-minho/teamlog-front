<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import { useTagStore } from "@/stores/tag";
import TeamListItem from "./components/TeamListItem.vue";
import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import TeamListSkeletonItem from "./components/TeamListSkeletonItem.vue";
import TeamTagList from "./components/TeamTagList.vue";

const route = useRoute();
const groupStore = useGroupStore();
const { fetchGroups } = groupStore;
const { groups, groupsLoading } = storeToRefs(groupStore);
const tagStore = useTagStore();
const { currentTag } = storeToRefs(tagStore);

const page = ref(1);

const loadMore = async (el: Element) => {
  const existsPosts = await fetchGroups(page.value);
  if (existsPosts) {
    page.value++;
  } else {
    el.innerHTML = "";
  }
};

watch(
  () => currentTag.value,
  () => {
    groupsLoading.value = true;
    page.value = 1;
    fetchGroups();
    page.value++;
  },
  { immediate: true }
);

const refresh = async (done: () => void) => {
  groupsLoading.value = true;
  page.value = 1;
  await fetchGroups();
  page.value++;
  done();
};
</script>

<template>
  <NuxtLayout name="main" @pull2refresh="refresh">
    <TeamTagList />
    <q-page class="q-mt-sm" style="min-height: 0">
      <template v-if="groupsLoading">
        <TeamListSkeletonItem v-for="i in 10" :key="i" />
      </template>
      <template v-else>
        <TeamListItem v-for="group in groups" :key="group.id" :group="group" />
        <ScrollObserver @trigger-intersected="loadMore">
          <TeamListSkeletonItem />
        </ScrollObserver>
      </template>
    </q-page>
  </NuxtLayout>
</template>
