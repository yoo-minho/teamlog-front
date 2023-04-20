<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePostStore } from "@/stores/post";
import { ref, watch } from "vue";
import { useTagStore } from "@/stores/tag";
import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import PostListItem from "@/components/PostListItem.vue";
import PostListSkeletonItem from "@/components/PostListSkeletonItem.vue";
import PostTagList from "./components/PostTagList.vue";
import PostEmpty from "./components/PostEmpty.vue";

import { POST_TAG } from "@/constants";
import { useUserStore } from "@/stores/user";

const tagStore = useTagStore();
const { currentTag, isTotalTag } = storeToRefs(tagStore);

const userStore = useUserStore();
const { searchWord } = storeToRefs(userStore);

const postStore = usePostStore();
const { fetchSearchPosts } = postStore;
const { posts, postLoading, tagWord } = storeToRefs(postStore);

const page = ref(1);

const loadMore = async (el: Element) => {
  const existsPosts = await fetchSearchPosts(page.value);
  if (existsPosts) {
    page.value++;
  } else {
    el.innerHTML = "";
  }
};

watch(
  [() => currentTag.value, () => searchWord.value],
  () => {
    postLoading.value = true;
    page.value = 1;
    tagWord.value = isTotalTag.value
      ? ""
      : POST_TAG.find((v) => v.label === currentTag.value)?.value || "";
    fetchSearchPosts();
    page.value++;
  },
  { immediate: true }
);

const refresh = async (done: () => void) => {
  postLoading.value = true;
  page.value = 1;
  await fetchSearchPosts();
  page.value++;
  done();
};
</script>

<template>
  <NuxtLayout name="main" @pull2refresh="refresh">
    <PostTagList />
    <template v-if="postLoading">
      <PostListSkeletonItem v-for="i in 10" :key="i" />
    </template>
    <template v-if="posts.length === 0">
      <PostEmpty />
    </template>
    <template v-else>
      <q-page class="q-mt-sm">
        <div class="max-width">
          <PostListItem v-for="(post, i) in posts" :key="i" :post="post" />
          <ScrollObserver
            v-if="posts.length >= 10"
            @trigger-intersected="loadMore"
          >
            <PostListSkeletonItem />
          </ScrollObserver>
        </div>
      </q-page>
    </template>
  </NuxtLayout>
</template>
