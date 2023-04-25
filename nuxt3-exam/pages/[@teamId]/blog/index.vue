<script setup lang="ts">
import { useGroupStore } from "~/stores/group";
import { storeToRefs } from "pinia";
import { getPlatformStat } from "@/hooks/usePlatformStat";
import { LinkWrap } from "~/types/common";

const groupStore = useGroupStore();
const { currentGroup } = storeToRefs(groupStore);

const linkCountByPlatform = computed(() =>
  getPlatformStat(currentGroup.value.links as LinkWrap[])
);
</script>
<template>
  <div>
    <div class="max-width">
      <div class="row q-px-sm">
        <PlatformStatList :link-count-by-platform="linkCountByPlatform" />
      </div>
      <q-separator spaced style="height: 8px" />
      <BlogListItem
        v-for="({ link }, i) in currentGroup.links"
        :key="i"
        :link="link"
      />
    </div>
  </div>
</template>
