<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePostStore } from "@/stores/post";
import { useTeamStore } from "@/stores/team";

import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import PostApi from "@/api/postApi";

const [teamStore, postStore] = [useTeamStore(), usePostStore()];
const { posts } = storeToRefs(postStore);
const { savePosts } = postStore;
const { currentTeam } = storeToRefs(teamStore);
const page = ref(1);
const isExistsNextPage = ref(false);
const isScrapRefresh = ref(false);
const teamId = useState<string>("teamId");
const {
  data: _posts,
  refresh: refreshPosts,
  pending,
} = await PostApi.findPosts({
  page,
  teamId,
});

watch(
  _posts,
  () => {
    savePosts(page.value === 1, _posts.value || []);
    isExistsNextPage.value = _posts.value?.length === 10;
  },
  { immediate: true }
);

const refreshPostData = async ({ init = false } = {}) => {
  if (init) page.value = 1;
  await refreshPosts();
  savePosts(init, _posts.value);
  isExistsNextPage.value = _posts.value?.length === 10;
};

const next = () => {
  if (!isExistsNextPage.value) return;
  page.value++;
  refreshPostData({ init: false });
};

watch([() => currentTeam.value?.lastPostCreatedAt], async (_, oldVal) => {
  if (!oldVal[0]) return; //lastPostCreatedAt 최초 할당시에는 미동작
  isScrapRefresh.value = true;
  await refreshPostData({ init: true });
  isScrapRefresh.value = false;
});

definePageMeta({
  layout: "in-team",
});
</script>
<template>
  <template v-if="pending && page === 1 && !isScrapRefresh">
    <PostListSkeletonItem v-for="i in 12" :key="i" />
  </template>
  <template v-else>
    <template v-if="posts.length > 0">
      <PostListItem v-for="(post, i) in posts" :key="i" :post="post" />
    </template>
    <ClientOnly>
      <template v-if="isExistsNextPage">
        <ScrollObserver @trigger-intersected="next">
          <PostListSkeletonItem />
        </ScrollObserver>
      </template>
    </ClientOnly>
  </template>
</template>
