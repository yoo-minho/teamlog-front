<script setup lang="ts">
import { storeToRefs } from "pinia";
import InTeamHeader from "@/components/Menu/InTeamHeader.vue";
import GroupInfo from "@/components/Info/GroupInfo.vue";
import GroupInfoSkeleton from "@/components/Info/GroupInfoSkeleton.vue";
import GroupDetailCounter from "@/components/Counter/GroupDetailCounter.vue";
import GroupApi from "@/api/groupApi";
import RssApi from "@/api/rssApi";
import { TAB_LABEL_IN_TEAM } from "@/constants/";
import { useTeamStore } from "@/stores/team";
import { Group, LinkWrap } from "@/types/common";
import { delay } from "@/utils/CommUtil";
import { isTodayByDate } from "@/plugin/dayjs";

const $q = useQuasar();
const teamId = useState<string>("teamId");
const tabId = useState<string>("tabId");

const tab = ref(tabId.value);
const teamStore = useTeamStore();
const { currentTeam } = storeToRefs(teamStore);
const isDark = ref($q.dark.isActive);

const scrapPosts = async (id: number, links: LinkWrap[]) => {
  if (links.length === 0) return;
  await Promise.allSettled([
    ...links.map(({ link }) => RssApi.scrap(link)),
    delay(1000),
  ]);
  const { data } = await GroupApi.updateStat(id);
  const rawData = data.value as {
    lastPostCreatedAt: Date;
    weeklyAvgPost: number;
  };
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
    currentTeam.value = team.value as Group;
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
      <template v-if="pending">
        <InTeamHeader group-title="" style="position: relative" />
      </template>
      <template v-else-if="currentTeam">
        <InTeamHeader
          :group-id="currentTeam.id"
          :group-title="currentTeam.title"
          style="position: relative"
        />
      </template>
      <q-scroll-area
        ref="scrollAreaRef"
        class="max-width without-header in-team"
        :visible="true"
        style="height: calc(100vh - 50px); overflow: hidden"
      >
        <q-layout style="min-height: 0">
          <q-page-container style="min-height: 0; padding: 0">
            <q-pull-to-refresh @refresh="refresh" class="q-mt-xs">
              <q-page>
                <GroupDetailCounter
                  :today-views="currentTeam?.todayViews"
                  :total-views="currentTeam?.totalViews"
                />
                <template v-if="pending">
                  <GroupInfoSkeleton />
                </template>
                <template v-else-if="currentTeam">
                  <GroupInfo :group-data="currentTeam" />
                  <div class="tag-scroll row justify-center">
                    <div
                      v-for="({ tag: { name } }, i) in currentTeam.tags"
                      :key="i"
                    >
                      <div
                        @click="
                          navigateTo({ path: '/team', query: { tag: name } })
                        "
                      >
                        <q-chip outline square clickable> #{{ name }} </q-chip>
                      </div>
                    </div>
                  </div>
                </template>
                <q-tabs
                  v-model="tab"
                  dense
                  :class="`text-grey js-tab bg-${isDark ? 'dark' : 'white'}`"
                  :active-color="`${isDark ? 'green-4' : 'primary'}`"
                  :indicator-color="`${isDark ? 'green-4' : 'primary'}`"
                  narrow-indicator
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
                <slot></slot>
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
