<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePostStore } from "@/stores/post";
import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import PostListItem from "@/components/PostListItem.vue";
import PostListSkeletonItem from "@/components/PostListSkeletonItem.vue";
import PostTagList from "./components/PostTagList.vue";
import PostApi from "@/api/postApi";
import { POST_TAG } from "@/constants";
import { useUserStore } from "@/stores/user";
import SearchEmpty from "~/components/Empty/SearchEmpty.vue";

definePageMeta({
  pageTransition: { mode: "out-in" },
  middleware: ["main-slide"],
});

const route = useRoute();
const userStore = useUserStore();
const { searchWord } = storeToRefs(userStore);
const postStore = usePostStore();
const { posts } = storeToRefs(postStore);
const { savePosts } = postStore;
const page = ref(1);
const selectTag = ref(String(route.query.tag || "All"));
searchWord.value = String(route.query.q || "");
const isExistsNextPage = ref(false);
const tags = ref(POST_TAG.map((v) => ({ id: v.label, name: v.label })));
const { data: _posts, refresh: refreshPost } = await PostApi.searchPosts({
  page: page,
  tag: selectTag,
  q: searchWord,
});
savePosts(true, _posts.value);
isExistsNextPage.value = _posts.value?.length === 10;

const refreshPostData = async ({ init = false } = {}) => {
  if (init) page.value = 1;
  await refreshPost();
  savePosts(init, _posts.value);
  isExistsNextPage.value = _posts.value?.length === 10;
};

const next = () => {
  if (!isExistsNextPage.value) return;
  page.value++;
  refreshPostData({ init: false });
};
const refresh = (dn: () => void) => refreshPostData({ init: true }).then(dn);
const filterTag = (tagName: string) => (selectTag.value = tagName);

watch([() => selectTag.value, () => searchWord.value], () =>
  refreshPostData({ init: true })
);
</script>

<template>
  <div class="page">
    <q-pull-to-refresh @refresh="refresh">
      <PostTagList
        @click-tag="filterTag"
        :tags="tags"
        :active-tag-name="selectTag"
      />
      <q-separator spaced />
      <q-page class="q-mt-sm" style="min-height: 0">
        <template v-if="posts.length > 0">
          <PostListItem v-for="(post, i) in posts" :key="i" :post="post" />
        </template>
        <template v-else>
          <SearchEmpty mode="SEARCH" />
        </template>
      </q-page>
      <ClientOnly>
        <template v-if="isExistsNextPage">
          <ScrollObserver @trigger-intersected="next">
            <PostListSkeletonItem />
          </ScrollObserver>
        </template>
      </ClientOnly>
    </q-pull-to-refresh>
  </div>
</template>
