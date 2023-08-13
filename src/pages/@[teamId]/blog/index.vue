<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTeamStore } from "@/stores/team";
import { getImage } from "@/utils/ImageUtil";
import { BLOG_TAG } from "@/constants";

const teamStore = useTeamStore();
const { currentTeam } = storeToRefs(teamStore);

//group by count
const currentBlogs = Object.entries<number>(
  currentTeam.value.links
    ?.map((v) => v.link.type)
    ?.reduce((a, c) => ((a[c] = (a[c] || 0) + 1), a), Object.create(null))
)
  .map(([key, value]) => ({ id: key, name: key, count: value }))
  .sort((v1, v2) => v2.count - v1.count);

const getLabel = (type: string) =>
  BLOG_TAG.find((v) => v.type === type)?.label || "All";

definePageMeta({
  layout: "in-team",
  middleware: ["team-slide"],
});
</script>
<template>
  <div>
    <div class="max-width">
      <div class="row q-px-sm q-pt-sm">
        <q-chip
          v-for="(tag, i) in currentBlogs"
          :key="i"
          outline
          square
          clickable
          color="dark"
          style="opacity: 0.8"
        >
          <q-avatar size="18px">
            <q-img
              :src="getImage(`platform/${tag.name.toLowerCase()}.png`)"
              :no-transition="true"
            />
          </q-avatar>
          {{ getLabel(tag.name) }}
          <div class="text-bold q-ml-sm">{{ tag.count }}</div>
        </q-chip>
      </div>
      <q-separator spaced />
      <BlogListItem
        v-for="({ link }, i) in currentTeam.links"
        :key="i"
        :link="link"
      />
    </div>
  </div>
</template>
