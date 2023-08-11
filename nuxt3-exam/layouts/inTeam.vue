<script setup lang="ts">
import { storeToRefs } from "pinia";
import InTeamHeader from "@/components/Header/InTeamHeader.vue";
import GroupApi from "@/api/groupApi";
import RssApi from "@/api/rssApi";
import { TAB_LABEL_IN_TEAM } from "@/constants/";
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
</script>
<template>
  <q-layout>
    <div :class="`${isDark ? 'bg-grey-9' : 'bg-white'}`">
      <InTeamHeader
        :team-id="team?.id"
        :team-title="team?.title"
        :createrId="team?.createrId"
      />
      <q-scroll-area
        ref="scrollAreaRef"
        class="max-width without-header in-team"
        :visible="true"
        style="height: calc(100vh - 50px); overflow: hidden"
      >
        <q-layout style="min-height: 0">
          <q-page-container style="min-height: 0; padding: 0">
            <q-pull-to-refresh @refresh="refresh" class="q-mt-xs">
              <q-page class="max-width">
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
                  <div v-for="(tag, i) in TAB_LABEL_IN_TEAM" :key="i">
                    <q-route-tab
                      :to="`/@${teamId}/${tag.name}`"
                      :label="tag.label"
                      :replace="true"
                      style="width: 100%"
                    />
                  </div>
                </q-tabs>
                <q-separator />
                <slot />
                <q-page-scroller
                  position="bottom-right"
                  :scroll-offset="150"
                  :offset="[18, 18]"
                >
                  <q-btn fab icon="keyboard_arrow_up" color="green-4" />
                </q-page-scroller>
              </q-page>
            </q-pull-to-refresh>
          </q-page-container>
        </q-layout>
      </q-scroll-area>
    </div>
  </q-layout>
</template>
