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
const { teams, lastSelectTag } = storeToRefs(teamStore);
const userStore = useUserStore();
const { tags, isExistsUser } = storeToRefs(userStore);

if (!lastSelectTag.value) {
  lastSelectTag.value = String(route.query.tag || "All");
}

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

const openNewTeam = () => {
  if (isExistsUser.value) {
    navigateTo({ path: "/new/team" });
    return;
  }
  showAuthDialog({ to: "/new/team" });
};

const isCached = () =>
  _fromRouteName.value !== "team" && teams.value.length > 0;
const page = ref(1);
const response = await GroupApi.findAll({
  page,
  tag: lastSelectTag,
  sort: selectedOrder,
});
const { data: _teams, refresh: refreshTeam, pending } = response;
const currentTeams = ref(isCached() ? teams.value : []);
const isExistsNextPage = ref(false);

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
    setTimeout(() => {
      teams.value = currentTeams.value;
      isExistsNextPage.value =
        currentTeams.value.length > 0 && currentTeams.value?.length % 10 === 0;
    }, 100); //하이드레이션 이슈가 생겨!
  },
  { immediate: !isCached() }
);
watch([lastSelectTag, selectedOrder], () => refreshTeamData({ init: true }));

const refreshTeamData = async ({ init = false } = {}) => {
  page.value = (init ? 0 : Math.ceil(teams.value.length / 10)) + 1;
  await refreshTeam();
};
const next = () => refreshTeamData({ init: false });
const refresh = (dn: () => void) => refreshTeamData({ init: true }).then(dn);
const filterTag = (tagName: string) => (lastSelectTag.value = tagName);
const updateOption = (x: any) => {
  selectedOrder.value = x.value;
  groupSort.value = x.value;
};
const _teamScrollVPos = useState<number>("teamScrollVPos");

definePageMeta({
  layout: "default",
});

const scroll = (info: any) => {
  if (info.verticalPosition > 0) {
    _teamScrollVPos.value = info.verticalPosition;
  }
};
const scrollRef = ref();
watch(scrollRef, (scrollDom) => {
  let value;
  if (_fromRouteName.value.includes("@teamId")) {
    value = _teamScrollVPos.value <= 200 ? 0 : _teamScrollVPos.value;
  } else {
    value = 0;
  }
  scrollDom.setScrollPosition("vertical", value, 0);
});
</script>
<template>
  <q-scroll-area
    @scroll="scroll"
    ref="scrollRef"
    style="height: calc(100vh - 100px)"
    :visible="false"
  >
    <q-pull-to-refresh @refresh="refresh">
      <q-layout class="max-width">
        <q-page-container>
          <q-page>
            <TeamTagList
              @click-tag="filterTag"
              :tags="tags"
              :active-tag-name="lastSelectTag"
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
            <template v-if="pending && currentTeams.length === 0">
              <template v-for="i in 10">
                <TeamListSkeletonItem />
              </template>
            </template>
            <template v-else>
              <template v-if="currentTeams.length > 0">
                <TeamListItem
                  where="MAIN"
                  v-for="team in currentTeams"
                  :key="team.id"
                  :team="team"
                />
              </template>
              <template v-else>
                <q-item-label class="q-mx-sm">
                  <q-item class="q-px-sm justify-center text-center">
                    <div>
                      <div class="text-subtitle2 q-pt-md">
                        아직 만든 팀 블로그가 없군요.
                      </div>
                      <div class="text-weight-bold text-subtitle1 q-pb-md">
                        당신만의 팀 블로그를 만들어볼래요?
                      </div>
                      <q-img
                        :src="getImage('undraw_project_team.svg')"
                        :fit="'fill'"
                      />
                      <q-btn
                        class="q-mt-md"
                        align="around"
                        color="green-4"
                        label="팀 블로그 만들기"
                        @click="openNewTeam()"
                      />
                    </div>
                  </q-item>
                </q-item-label>
              </template>
              <ClientOnly>
                <template v-if="isExistsNextPage">
                  <ScrollObserver @trigger-intersected="next">
                    <TeamListSkeletonItem />
                  </ScrollObserver>
                </template>
              </ClientOnly>
            </template>
            <q-page-scroller
              position="bottom-right"
              :scroll-offset="150"
              :offset="[18, 18]"
            >
              <q-btn fab icon="keyboard_arrow_up" color="green-3" />
            </q-page-scroller>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-pull-to-refresh>
  </q-scroll-area>
</template>
