<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePostStore } from "@/stores/post";
import { useGroupStore } from "~/stores/group";
import { useUserStore } from "~/stores/user";

import GroupDetailPostLoader from "@/components/Loader/GroupDetailPostLoader.vue";
import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import PostApi from "@/api/postApi";
import SearchEmpty from "~/components/Empty/SearchEmpty.vue";

definePageMeta({
  pageTransition: { mode: "out-in" },
  middleware: ["team-slide"],
});

const postStore = usePostStore();
const { posts } = storeToRefs(postStore);
const { savePosts } = postStore;
const groupStore = useGroupStore();
const { currentGroup } = storeToRefs(groupStore);
const userStore = useUserStore();
const { searchWord } = storeToRefs(userStore);

const route = useRoute();
const page = ref(1);
const isExistsNextPage = ref(false);
searchWord.value = String(route.query.q || "");

const { data: _posts, refresh: refreshPosts } = await PostApi.searchPosts({
  page: page,
  links: currentGroup.value.links,
  q: searchWord,
});
savePosts(true, _posts.value);
isExistsNextPage.value = posts.value?.length === 10;

const refreshPostData = async ({ init = false } = {}) => {
  if (init) page.value = 1;
  await refreshPosts();
  savePosts(init, _posts.value);
  isExistsNextPage.value = posts.value?.length === 10;
};

const next = () => {
  if (!isExistsNextPage.value) return;
  page.value++;
  refreshPostData({ init: false });
};

const refresh = async (done: () => void) => {
  await refreshPostData({ init: true });
  done();
};

watch(
  [() => currentGroup.value.lastPostCreatedAt, () => searchWord.value],
  () => refreshPostData({ init: true })
);
</script>
<template>
  <div class="max-width">
    <q-pull-to-refresh @refresh="refresh" class="q-mt-xs">
      <template v-if="posts.length > 0">
        <PostListItem v-for="(post, i) in posts" :key="i" :post="post" />
      </template>
      <template v-else>
        <SearchEmpty mode="SEARCH" />
      </template>
      <ClientOnly>
        <template v-if="isExistsNextPage">
          <ScrollObserver @trigger-intersected="next">
            <GroupDetailPostLoader />
          </ScrollObserver>
        </template>
      </ClientOnly>
    </q-pull-to-refresh>
  </div>
</template>
<style scoped>
.scroller {
  height: 100%;
}
</style>
