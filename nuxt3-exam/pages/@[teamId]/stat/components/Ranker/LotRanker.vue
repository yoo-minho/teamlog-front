<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import { usePostStore } from "@/stores/post";
import PostAPI from "@/api/postApi";
import Ranker from "./Ranker.vue";

const [groupStore, postStore] = [useGroupStore(), usePostStore()];
const { lots } = storeToRefs(postStore);
const { currentGroup } = storeToRefs(groupStore);

//define
const linkIds = ref(currentGroup.value.links?.map(({ link: l }) => l.id) || []);

//created
const { data: _lot } = await PostAPI.findCountGroupById({ linkIds });
lots.value = _lot.value || [];
const transLots = lots.value.map((v) => ({ ...v, stat: v.count + "건" }));
</script>
<template>
  <Ranker title="최다작성" :data="transLots" />
</template>
