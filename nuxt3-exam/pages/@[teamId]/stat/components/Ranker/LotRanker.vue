<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTeamStore } from "@/stores/team";
import PostAPI from "@/api/postApi";
import Ranker from "./Ranker.vue";
import { RankerStat } from "@/types/common";

const teamStore = useTeamStore();
const { currentTeamLinkIds } = storeToRefs(teamStore);

//define
const transLots = ref([] as RankerStat[]);
const linkIds = ref(currentTeamLinkIds.value);

//created
const { data: _lot, pending } = await PostAPI.findCountGroupById({
  linkIds,
});
watch(
  _lot,
  () => {
    transLots.value =
      _lot.value?.map((v) => ({ linkId: v.linkId, stat: v.count + "건" })) ||
      [];
  },
  { immediate: true }
);
</script>
<template>
  <Ranker :pending="pending" title="최다작성" :data="transLots" />
</template>
