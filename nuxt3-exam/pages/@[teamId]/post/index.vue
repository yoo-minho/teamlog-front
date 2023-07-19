<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePostStore } from "@/stores/post";
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";

import SearchEmpty from "@/components/Empty/SearchEmpty.vue";
import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import PostApi from "@/api/postApi";

definePageMeta({
  pageTransition: { mode: "out-in" },
  middleware: ["team-slide"],
});

const route = useRoute();

const [groupStore, postStore, userStore] = [
  useGroupStore(),
  usePostStore(),
  useUserStore(),
];
const { posts } = storeToRefs(postStore);
const { savePosts } = postStore;
const { currentGroup } = storeToRefs(groupStore);
const { searchWord } = storeToRefs(userStore);
const { setSearchData } = userStore;

const page = ref(1);
const isExistsNextPage = ref(false);
const teamId = useState<string>("teamId");

setSearchData(String(route.query.q || ""));

const {
  data: _posts,
  refresh: refreshPosts,
  pending,
} = await PostApi.findPosts({
  page,
  teamId,
  q: searchWord,
});

watch(
  _posts,
  () => {
    savePosts(true, _posts.value);
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

const refresh = async (done: () => void) => {
  await refreshPostData({ init: true });
  done();
};

watch(
  [() => currentGroup.value?.lastPostCreatedAt, searchWord],
  (_, oldVal) => {
    if (!oldVal[0]) return; //lastPostCreatedAt 최초 할당시에는 미동작
    refreshPostData({ init: true });
  }
);
</script>
<template>
  <div class="max-width">
    <q-pull-to-refresh @refresh="refresh" class="q-mt-xs">
      <template v-if="pending && page === 1">
        <PostListSkeletonItem v-for="i in 12" :key="i" />
      </template>
      <template v-else>
        <template v-if="posts.length > 0">
          <PostListItem v-for="(post, i) in posts" :key="i" :post="post" />
        </template>
        <template v-else>
          <SearchEmpty mode="SEARCH" />
        </template>
        <ClientOnly>
          <template v-if="isExistsNextPage">
            <ScrollObserver @trigger-intersected="next">
              <PostListSkeletonItem />
            </ScrollObserver>
          </template>
        </ClientOnly>
      </template>
    </q-pull-to-refresh>
  </div>
</template>
<style scoped>
.scroller {
  height: 100%;
}
</style>
