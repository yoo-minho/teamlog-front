<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTeamStore } from "@/stores/team";
import PostAPI from "@/api/postApi";
import Ranker from "./Ranker.vue";
import { RankerStat } from "@/types/common";

const teamStore = useTeamStore();
const { currentTeamLinkIds } = storeToRefs(teamStore);

//define
const transLastPosts = ref([] as RankerStat[]);
const linkIds = ref(currentTeamLinkIds.value);

//created
const { data: _lasts, pending } = await PostAPI.findLast({
  linkIds,
});

watch(
  _lasts,
  () => {
    transLastPosts.value =
      _lasts.value?.map((v) => ({
        linkId: v.linkId,
        stat: v.agoString,
      })) || [];
  },
  { immediate: true }
);
</script>
<template>
  <Ranker :pending="pending" title="최근작성" :data="transLastPosts" />
</template>
