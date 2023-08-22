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
import { teamSeoTitle, teamSeoDesc } from "@/constants/seo";

const $q = useQuasar();
const teamId = useState<string>("teamId");
const tabId = useState<string>("tabId");

const tab = ref(tabId.value);
const teamStore = useTeamStore();
const { currentTeam, teams } = storeToRefs(teamStore);
const isDark = ref($q.dark.isActive);
const route = useRoute();

const useHeadFunc = (props: any) => {
  const { ttl, wap, desc } = props;
  const _title = teamSeoTitle(ttl);
  const _desc = teamSeoDesc(wap, desc);

  useHead({
    title: _title,
    meta: [
      { name: "description", content: _desc },
      { property: "og:title", content: _title },
      { property: "og:description", content: _desc },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `https://teamlog.team${route.fullPath}` },
      { property: "og:locale", content: "ko_KR" },
      { property: "og:image", content: "https://teamlog.team/og2.png" },
    ],
  });
};

const tempTeam = teams.value.find((t) => t.domain === teamId.value);
const { title, weeklyAvgPost: wap, description } = tempTeam || {};
useHeadFunc({ ttl: title, wap, desc: description });

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
const top = ref(true);

watch(
  team,
  () => {
    if (!team.value) return;
    currentTeam.value = team.value;
    const { title, weeklyAvgPost: wap, description } = currentTeam.value;
    useHeadFunc({ ttl: title, wap, desc: description });
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
  if (!newTab || !top.value) return;
  await navigateTo(newTab, { replace: true });
  tab.value = newTab;
};

const scroll = (info: any) => {
  top.value = info.verticalPosition <= 20;
};
</script>
<template>
  <q-layout>
    <div :class="`${isDark ? 'bg-grey-9' : 'bg-white'}`">
      <InTeamHeader :top="top" />
      <q-scroll-area
        @scroll="scroll"
        class="max-width without-header in-team"
        :visible="false"
        style="height: calc(100vh - 50px); overflow: hidden"
      >
        <q-pull-to-refresh @refresh="refresh" class="q-mt-xs">
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
                  v-touch-swipe.mouse.horizontal="handleSwipe"
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
                  <q-btn
                    fab
                    icon="keyboard_arrow_up"
                    color="green-3"
                    label="scrollTop"
                  />
                </q-page-scroller>
              </q-page>
            </q-page-container>
          </q-layout>
        </q-pull-to-refresh>
      </q-scroll-area>
    </div>
  </q-layout>
</template>
<style scoped>
.my-panels .q-panel.scroll {
  overflow: hidden;
}
</style>
