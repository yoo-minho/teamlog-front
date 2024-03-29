<script setup lang="ts">
import { Team } from "@/types/common";
import { isTextImage, thumbImg } from "@/utils/ImageUtil";
import { getFormatString } from "@/plugin/dayjs";
import TeamCounter from "@/components/Counter/TeamCounter.vue";

const props = defineProps<{
  team?: Team;
  where: "MAIN" | "IN_TEAM";
}>();
const { team } = toRefs(props);
const moveTeam = () => {
  if (props.where === "IN_TEAM" || !team?.value) return;
  navigateTo(`/@${team.value.domain}/post`);
};
</script>
<template>
  <q-item-label
    class="q-mx-sm"
    :class="{ 'cursor-pointer': where === 'MAIN' }"
    @click="moveTeam()"
  >
    <q-item
      class="q-px-sm"
      style="overflow-x: hidden; min-height: 0 !important"
    >
      <TeamCounter
        :weekly-avg-post="team?.weeklyAvgPost"
        :today-views="team?.todayViews"
        :total-views="team?.totalViews"
      />
    </q-item>
    <q-item class="q-px-sm" style="overflow-x: hidden">
      <div v-for="(v, i) in team?.links || []" :key="i" class="q-mr-sm">
        <q-avatar
          v-if="isTextImage(v.link.imagePath)"
          color="black"
          text-color="white"
          rounded
          size="32px"
          class="shadow-1"
        >
          <div class="non-selectable">
            {{ v.link.title.substring(0, 2) }}
          </div>
        </q-avatar>
        <q-avatar
          v-else
          rounded
          size="32px"
          color="black"
          text-color="white"
          class="shadow-1"
        >
          <q-img
            :src="thumbImg(v.link.imagePath || '')"
            :alt="v.link.title"
            class="image-32"
            no-spinner
            :ratio="1"
            loading="eager"
          >
            <template #error>
              <div
                class="absolute-full flex flex-center bg-green-4 text-white"
                style="padding: 0"
              >
                {{ v.link.title.substring(0, 1) }}
              </div>
            </template>
          </q-img>
        </q-avatar>
      </div>
    </q-item>
    <q-item class="q-px-sm q-pt-sm">
      <q-item-section>
        <q-item-label class="text-weight-bolder row" style="font-size: 20px">
          <h1 v-if="where === 'IN_TEAM'">{{ team?.title || "" }}</h1>
          <h2 v-else>{{ team?.title || "" }}</h2>
          <span class="text-grey-5 q-mx-sm">{{ team?.links?.length }}</span>
        </q-item-label>
        <q-item-label class="ellipsis-2-lines">{{
          team?.description
        }}</q-item-label>
        <q-item-label class="text-grey-5 q-pt-sm">
          <span v-for="tag in team?.tags || []" class="q-mr-xs">
            #{{ tag.tag.name }}
          </span>
        </q-item-label>
        <q-item-label class="text-grey-5">
          {{
            getFormatString(team?.lastPostCreatedAt, "YYYY-MM-DD HH:mm (ddd)")
          }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-item-label>
  <q-separator :class="where === 'MAIN' ? 'q-my-sm' : 'q-mt-sm'" />
</template>
<style scope></style>
