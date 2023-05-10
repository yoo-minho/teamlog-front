<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import { usePostStore } from "@/stores/post";
import PostAPI from "@/api/postApi";
import Ranker from "./Ranker.vue";

const [groupStore, postStore] = [useGroupStore(), usePostStore()];
const { lastPosts } = storeToRefs(postStore);
const { currentGroup } = storeToRefs(groupStore);

//define
const linkIds = ref(currentGroup.value.links?.map(({ link: l }) => l.id) || []);

//created
const { data: _lasts } = await PostAPI.findLast({ linkIds });
lastPosts.value = _lasts.value || [];
const transLastPosts = lastPosts.value.map((v) => ({
  ...v,
  stat: v.agoString,
}));
</script>
<template>
  <Ranker title="최근작성" :data="transLastPosts" />
</template>
