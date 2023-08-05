<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePostStore } from "@/stores/post";
import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import PostListItem from "@/components/Post/PostListItem.vue";
import PostListSkeletonItem from "@/components/Post/PostListSkeletonItem.vue";
import PostTagList from "./components/PostTagList.vue";
import PostApi from "@/api/postApi";
import { POST_TAG } from "@/constants";
import { useUserStore } from "@/stores/user";
import SearchEmpty from "@/components/Empty/SearchEmpty.vue";

const route = useRoute();
const userStore = useUserStore();
// const { searchWord } = storeToRefs(userStore);
// searchWord.value = String(route.query.q || "");
const postStore = usePostStore();
const { posts } = storeToRefs(postStore);
const { savePosts } = postStore;
const page = ref(1);
const selectTag = ref(String(route.query.tag || "All"));
const searchWord = ref(String(route.query.q || ""));
const isExistsNextPage = ref(false);
const tags = ref(POST_TAG.map((v) => ({ id: v.label, name: v.label })));

const {
  data: _posts,
  refresh: refreshPost,
  pending,
} = await PostApi.findPosts({
  page: page,
  tag: selectTag,
  q: searchWord,
});
watch(
  _posts,
  () => {
    savePosts(page.value === 1, _posts.value);
    isExistsNextPage.value = _posts.value?.length === 10;
  },
  { immediate: true }
);

const refreshPostData = async ({ init = false } = {}) => {
  page.value = (init ? 0 : page.value) + 1;
  await refreshPost();
};

const next = () => refreshPostData({ init: false });
const refresh = (dn: () => void) => refreshPostData({ init: true }).then(dn);
const filterTag = (tagName: string) => (selectTag.value = tagName);
watch([selectTag, searchWord], () => refreshPostData({ init: true }));

definePageMeta({
  layout: "default",
  middleware: ["main-slide"],
});
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
        <template v-if="pending && posts.length === 0">
          <PostListSkeletonItem v-for="i in 12" :key="i" />
        </template>
        <template v-else>
          <template v-if="posts.length > 0">
            <PostListItem v-for="(post, i) in posts" :key="i" :post="post" />
            <ClientOnly>
              <template v-if="isExistsNextPage">
                <ScrollObserver @trigger-intersected="next">
                  <PostListSkeletonItem />
                </ScrollObserver>
              </template>
            </ClientOnly>
          </template>
          <template v-else>
            <SearchEmpty mode="SEARCH" />
          </template>
        </template>
      </q-page>
    </q-pull-to-refresh>
  </div>
</template>
