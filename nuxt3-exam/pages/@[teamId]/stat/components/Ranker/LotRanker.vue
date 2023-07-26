<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import PostAPI from "@/api/postApi";
import Ranker from "./Ranker.vue";
import { RankerStat } from "~/types/common";

const groupStore = useGroupStore();
const { currentGroupLinkIds } = storeToRefs(groupStore);

//define
const transLots = ref([] as RankerStat[]);
const linkIds = ref(currentGroupLinkIds.value);

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
