<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTeamStore } from "@/stores/team";
import { useUserStore } from "@/stores/user";
import TeamListItem from "./components/TeamListItem.vue";
import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import TeamListSkeletonItem from "./components/TeamListSkeletonItem.vue";
import TeamTagList from "./components/TeamTagList.vue";
import GroupApi from "@/api/groupApi";

const route = useRoute();
const _fromRouteName = useState<string>("fromRouteName");
const teamStore = useTeamStore();
const { teams } = storeToRefs(teamStore);
const userStore = useUserStore();
const { tags } = storeToRefs(userStore);

const options = [
  { label: "포스트 최신 작성순", value: "lastPostCreatedAt" },
  { label: "주간 게시물 많은 순", value: "weeklyAvgPost" },
  { label: "투데이 방문자 순", value: "todayViews" },
  { label: "누적 방문자 순", value: "totalViews" },
  { label: "팀 등록순", value: "createdAt" },
];

const groupSort = useCookie("groupSort");
const savedSortVal = groupSort.value || options[0].value;
const selectedOrderModel = ref(
  options.filter((v) => v.value === savedSortVal)[0]
);
const selectedOrder = ref(savedSortVal);
const selectedTag = ref(String(route.query.tag || "All"));

const isCached = () =>
  _fromRouteName.value !== "team" && teams.value.length > 0;
const page = ref(1);
const response = await GroupApi.findAll({
  page,
  tag: selectedTag,
  sort: selectedOrder,
});
const { data: _teams, refresh: refreshTeam, pending } = response;
const currentTeams = ref(isCached() ? teams.value : teams.value || []);
const isExistsNextPage = ref(true);

watch(
  _teams,
  (newTeams) => {
    if (isCached()) {
      //pass
    } else {
      currentTeams.value = [
        ...(page.value === 1 ? [] : currentTeams.value || []),
        ...(newTeams || []),
      ];
    }
    _fromRouteName.value = "team";
    teams.value = currentTeams.value;
    isExistsNextPage.value = teams.value.length % 10 === 0;
  },
  { immediate: !isCached() }
);

const refreshTeamData = async ({ init = false } = {}) => {
  page.value = (init ? 0 : Math.ceil(teams.value.length / 10)) + 1;
  await refreshTeam();
};
const next = () => refreshTeamData({ init: false });
const refresh = (dn: () => void) => refreshTeamData({ init: true }).then(dn);
const filterTag = (tagName: string) => (selectedTag.value = tagName);
const updateOption = (x: any) => {
  selectedOrder.value = x.value;
  groupSort.value = x.value;
};
watch([selectedOrder, selectedTag], () => refreshTeamData({ init: true }));

definePageMeta({
  layout: "default",
  middleware: ["main-slide"],
});
</script>
<template>
  <q-pull-to-refresh @refresh="refresh">
    <TeamTagList
      @click-tag="filterTag"
      :tags="tags"
      :active-tag-name="selectedTag"
    />
    <q-separator spaced style="margin-bottom: 0" />
    <q-select
      v-model="selectedOrderModel"
      :options="options"
      dense
      borderless
      class="q-mx-md"
      @update:model-value="updateOption"
    >
      <template v-slot:prepend>
        <q-icon name="filter_alt" />
      </template>
    </q-select>
    <q-separator spaced style="margin-top: 0" />
    <template v-if="pending && teams.length === 0">
      <template v-for="i in 10">
        <TeamListSkeletonItem />
      </template>
    </template>
    <template v-else>
      <TeamListItem
        where="MAIN"
        v-for="team in currentTeams"
        :key="team.id"
        :team="team"
      />
      <ClientOnly>
        <template v-if="isExistsNextPage">
          <ScrollObserver @trigger-intersected="next">
            <TeamListSkeletonItem />
          </ScrollObserver>
        </template>
      </ClientOnly>
    </template>
  </q-pull-to-refresh>
</template>
