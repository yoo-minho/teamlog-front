<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import PostAPI from "@/api/postApi";
import Ranker from "./Ranker.vue";
import { RankerStat } from "~/types/common";

const groupStore = useGroupStore();
const { currentGroupLinkIds } = storeToRefs(groupStore);

//define
const transLastPosts = ref([] as RankerStat[]);
const linkIds = ref(currentGroupLinkIds.value);

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
