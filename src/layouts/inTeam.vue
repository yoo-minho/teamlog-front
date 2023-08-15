<script setup lang="ts">
import { storeToRefs } from "pinia";
import InTeamHeader from "@/components/Header/InTeamHeader.vue";
import GroupApi from "@/api/groupApi";
import RssApi from "@/api/rssApi";
import { useTeamStore } from "@/stores/team";
import { LinkWrap, Team, TeamStatType } from "@/types/common";
import { isTodayByDate } from "@/plugin/dayjs";
import TeamListItem from "@/pages/team/components/TeamListItem.vue";
import TeamListSkeletonItem from "@/pages/team/components/TeamListSkeletonItem.vue";

const $q = useQuasar();
const teamId = useState<string>("teamId");
const tabId = useState<string>("tabId");

const tab = ref(tabId.value);
const teamStore = useTeamStore();
const { currentTeam } = storeToRefs(teamStore);
const isDark = ref($q.dark.isActive);

const scrapPosts = async (id: number, links: LinkWrap[]) => {
  if (links.length === 0) return;
  await Promise.allSettled(links.map(({ link }) => RssApi.scrap(link)));
  const { data } = await GroupApi.updateStat(id);
  const rawData = data.value as TeamStatType;
  currentTeam.value.lastPostCreatedAt = rawData.lastPostCreatedAt;
  currentTeam.value.weeklyAvgPost = rawData.weeklyAvgPost;
};

const refresh = (done: () => void) => {
  const { id, links } = currentTeam.value;
  if (!id || !links) return;
  scrapPosts(id, links).then(done);
};

const { data: team, pending } = await GroupApi.findByDomain(teamId.value);
const teamTitle = ref("");

watch(
  team,
  () => {
    if (!team.value) return;
    currentTeam.value = team.value;
    const { id = -1, links = [] } = currentTeam.value || {};
    const filterLinks = links?.filter(
      ({ link }) => !isTodayByDate(link.scrapAt)
    );
    scrapPosts(id, filterLinks);
  },
  { immediate: true }
);

watch(
  () => $q.dark.isActive,
  (val) => (isDark.value = val)
);

const handleSwipe = async (v: any) => {
  const newTab = getNextTab(v, ["blog", "post", "stat"]);
  if (!newTab) return;
  await navigateTo(newTab);
  tab.value = newTab;
};

const scroll = (info: any) => {
  if (info.verticalPosition > 20) {
    if (teamTitle.value === "") {
      teamTitle.value = currentTeam.value.title;
    }
  } else {
    teamTitle.value = "";
  }
};
</script>
<template>
  <q-layout>
    <div :class="`${isDark ? 'bg-grey-9' : 'bg-white'}`">
      <InTeamHeader
        :team-id="team?.id"
        :team-title="teamTitle"
        :createrId="team?.createrId"
      />
      <q-pull-to-refresh @refresh="refresh" class="q-mt-xs">
        <q-scroll-area
          @scroll="scroll"
          class="max-width without-header in-team"
          :visible="false"
          style="height: calc(100vh - 50px); overflow: hidden"
        >
          <q-layout class="max-width">
            <q-page-container>
              <q-page>
                <TeamListSkeletonItem v-if="pending" />
                <TeamListItem v-else :team="(team as Team)" where="IN_TEAM" />
                <q-tabs
                  v-model="tab"
                  dense
                  :class="`bg-${isDark ? 'dark' : 'white'}`"
                  :active-color="`${isDark ? 'green-4' : 'primary'}`"
                  :indicator-color="`${isDark ? 'green-4' : 'primary'}`"
                  style="justify-content: flex-start"
                >
                  <q-route-tab
                    name="blog"
                    :to="`/@${teamId}/blog`"
                    :replace="true"
                    label="블로그"
                    no-caps
                    style="flex: 1"
                  />
                  <q-route-tab
                    name="post"
                    :to="`/@${teamId}/post`"
                    :replace="true"
                    label="포스트"
                    no-caps
                    style="flex: 1"
                  />
                  <q-route-tab
                    name="stat"
                    :to="`/@${teamId}/stat`"
                    :replace="true"
                    label="통계"
                    no-caps
                    style="flex: 1"
                  />
                </q-tabs>
                <q-separator />
                <q-tab-panels
                  v-model="tab"
                  animated
                  class="my-panels"
                  v-touch-swipe.mouse="handleSwipe"
                >
                  <q-tab-panel name="blog" class="q-pa-none">
                    <slot />
                  </q-tab-panel>
                  <q-tab-panel name="post" class="q-pa-none">
                    <slot />
                  </q-tab-panel>
                  <q-tab-panel name="stat" class="q-pa-none">
                    <slot />
                  </q-tab-panel>
                </q-tab-panels>
                <q-page-scroller
                  position="bottom-right"
                  :scroll-offset="150"
                  :offset="[18, 18]"
                >
                  <q-btn fab icon="keyboard_arrow_up" color="green-4" />
                </q-page-scroller>
              </q-page>
            </q-page-container>
          </q-layout>
        </q-scroll-area>
      </q-pull-to-refresh>
    </div>
  </q-layout>
</template>
<style scoped>
.my-panels .q-panel.scroll {
  overflow: hidden;
}
</style>
