<script setup lang="ts">
import { useQuasar } from "quasar";
import InTeamHeader from "~/components/Menu/InTeamHeader.vue";
import GroupInfo from "@/components/Info/GroupInfo.vue";
import GroupDetailCounter from "@/components/Counter/GroupDetailCounter.vue";
import GroupApi from "@/api/groupApi";
import { TAB_LABEL_IN_TEAM } from "@/constants/";
import { useGroupStore } from "@/stores/group";
import { storeToRefs } from "pinia";
import { Group } from "~/types/common";

const $q = useQuasar();
const isDark = ref($q.dark.isActive);
const route = useRoute();
const router = useRouter();
const teamId = String(route.params.teamId).replace("@", "");
const groupStore = useGroupStore();
const { currentGroup } = storeToRefs(groupStore);

const { data: currentTeam } = await GroupApi.findById(teamId);
currentGroup.value = currentTeam.value as Group;

const goTagTeam = (tag: string) =>
  router.push({ path: "/team", query: { tag } });

watch(
  () => $q.dark.isActive,
  (val) => (isDark.value = val)
);

const tab = ref(route.path.replace(`/${route.params.teamId}/`, ""));
</script>
<template>
  <q-layout>
    <div :class="`${isDark ? 'bg-grey-9' : 'bg-white'}`">
      <q-scroll-area
        ref="scrollAreaRef"
        class="max-width without-header in-team"
        :visible="true"
        style="overflow: hidden"
        :thumb-style="{ zIndex: '999999' }"
      >
        <InTeamHeader style="position: relative" />
        <q-layout style="min-height: 0">
          <q-page-container style="min-height: 0; padding: 0">
            <q-page v-if="currentTeam">
              <GroupDetailCounter
                :today-views="currentTeam.todayViews || 0"
                :total-views="currentTeam.totalViews || 0"
              />
              <GroupInfo :group-data="currentTeam" />
              <div class="tag-scroll row justify-center">
                <template v-for="({ tag }, i) in currentTeam.tags" :key="i">
                  <div @click="() => goTagTeam(tag.name)">
                    <q-chip outline square clickable>#{{ tag.name }}</q-chip>
                  </div>
                </template>
              </div>
              <q-tabs
                v-model="tab"
                dense
                :class="`text-grey js-tab bg-${isDark ? 'dark' : 'white'}`"
                :active-color="`${isDark ? 'green-4' : 'primary'}`"
                :indicator-color="`${isDark ? 'green-4' : 'primary'}`"
                narrow-indicator
              >
                <template v-for="(tag, i) in TAB_LABEL_IN_TEAM" :key="i">
                  <q-route-tab
                    :to="`/@${teamId}/${tag.name}`"
                    :label="tag.label"
                  />
                </template>
              </q-tabs>
              <q-separator style="height: 8px" />
              <slot></slot>
            </q-page>
          </q-page-container>
          <q-page-scroller
            position="bottom-right"
            :scroll-offset="150"
            :offset="[18, 18]"
          >
            <q-btn fab icon="keyboard_arrow_up" color="green-4" />
          </q-page-scroller>
        </q-layout>
      </q-scroll-area>
    </div>
  </q-layout>
</template>
