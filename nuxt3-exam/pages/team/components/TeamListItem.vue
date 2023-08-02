<script setup lang="ts">
import { BlogType, Group } from "@/types/common";
import { isTextImage } from "@/utils/ImageUtil";
import { getFormatString } from "@/plugin/dayjs";
import { BLOG_TAG } from "@/constants/";

const props = defineProps<{ group: Group }>();
const { group } = toRefs(props);
const moveTeam = () => navigateTo(`/@${group.value.domain}/post`);
const getBlogColor = (type: BlogType) =>
  BLOG_TAG.find((t) => t.type === type)?.color;
</script>
<template>
  <q-item-label class="cursor-pointer q-mx-sm items-center" @click="moveTeam()">
    <q-item class="q-px-sm" style="overflow-x: hidden">
      <div v-for="(v, i) in group.links" :key="i" class="q-mr-sm">
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
            :src="v.link.imagePath"
            :alt="v.link.title"
            class="image-32"
            no-spinner
            :ratio="1"
            loading="eager"
          >
            <template #error>
              <div
                class="absolute-full flex flex-center bg-negative text-white"
                style="padding: 0"
              >
                {{ v.link.title.substring(0, 2) }}
              </div>
            </template>
          </q-img>
        </q-avatar>
      </div>
    </q-item>
    <q-item class="q-px-sm q-pt-none">
      <q-item-section>
        <q-item-label class="text-weight-bolder row" style="font-size: 16px">
          <span>{{ group.title }}</span>
          <span class="text-grey-5 q-mx-sm">{{ group.links?.length }}</span>
        </q-item-label>
        <q-item-label class="ellipsis-2-lines">{{
          group.description
        }}</q-item-label>
        <q-item-label class="text-grey-5">
          {{
            getFormatString(group.lastPostCreatedAt, "YYYY-MM-DD HH:mm (ddd)")
          }}
        </q-item-label>
        <q-item-label class="text-grey-5 q-pt-xs">
          <q-chip
            square
            outline
            dense
            color="green-4"
            class="views q-mr-xs"
            :label="'주간 게시물 ' + group.weeklyAvgPost + '개'"
          />
          <q-chip
            square
            outline
            dense
            color="green-3"
            class="views q-mr-xs"
            :label="'today ' + group.todayViews"
          />
          <q-chip
            square
            outline
            dense
            color="green-2"
            class="views"
            :label="
              'total ' + ((group.totalViews || 0) + (group.todayViews || 0))
            "
          />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-item-label>
  <q-separator spaced />
</template>
<style scope>
.views {
  font-size: 12px;
  opacity: 0.8;
  margin: 0;
  margin-right: 4px;
}
</style>
