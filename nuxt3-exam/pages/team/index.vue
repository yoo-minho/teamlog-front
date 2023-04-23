<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import TeamListItem from "./components/TeamListItem.vue";
import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import TeamListSkeletonItem from "./components/TeamListSkeletonItem.vue";
import TeamTagList from "./components/TeamTagList.vue";
import GroupApi from "@/api/groupApi";

const route = useRoute();
const groupStore = useGroupStore();
const { groups, groupSort } = storeToRefs(groupStore);
const { addTeams } = groupStore;

const page = ref(1);
const selectedTag = ref(String(route.query.tag || "All"));
const selectedOrder = ref(groupSort.value);
const isExistsNextPage = ref(false);

const { data: tags = ref([]) } = await GroupApi.findAllTag();
const { data: teams, refresh: refreshTeam } = await GroupApi.findAll({
  page: page,
  tag: selectedTag,
  sort: selectedOrder,
});
groups.value = teams.value || []; //create
isExistsNextPage.value = teams.value?.length === 10;

const refreshTeamData = async ({ init = false } = {}) => {
  if (init) page.value = 1;
  await refreshTeam();
  addTeams({ teams: teams.value || [], init });
  isExistsNextPage.value = teams.value?.length === 10;
};

const next = () => {
  page.value++;
  refreshTeamData({ init: false });
};

const refresh = (dn: () => void) => refreshTeamData({ init: true }).then(dn);

//props
const filterTag = (tagName: string) => (selectedTag.value = tagName);

//pinia
watch(
  () => groupSort.value,
  (v) => (selectedOrder.value = v)
);

watch([() => selectedOrder.value, () => selectedTag.value], () =>
  refreshTeamData({ init: true })
);
</script>

<template>
  <div>
    <q-pull-to-refresh @refresh="refresh">
      <TeamTagList
        @click-tag="filterTag"
        :tags="tags"
        :active-tag-name="selectedTag"
      />
      <q-separator spaced style="height: 8px" />
      <q-page class="q-mt-sm" style="min-height: 0">
        <TeamListItem v-for="group in groups" :key="group.id" :group="group" />
      </q-page>
      <ClientOnly>
        <template v-if="isExistsNextPage">
          <ScrollObserver @trigger-intersected="next">
            <TeamListSkeletonItem />
          </ScrollObserver>
        </template>
      </ClientOnly>
    </q-pull-to-refresh>
  </div>
</template>
