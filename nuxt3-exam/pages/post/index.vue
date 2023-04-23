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

const route = useRoute();

const userStore = useUserStore();
const { searchWord } = storeToRefs(userStore);

const postStore = usePostStore();
const { posts } = storeToRefs(postStore);

const page = ref(1);
const selectTag = ref(String(route.query.tag || "All"));
const selectQ = ref(String(route.query.q || ""));
const isExistsNextPage = ref(false);

const tags = ref(POST_TAG.map((v) => ({ id: v.label, name: v.label })));
const { data: _posts, refresh: refreshPost } = await PostApi.searchPosts({
  page: page,
  tag: selectTag,
  q: selectQ,
});
posts.value = _posts.value || [];
isExistsNextPage.value = posts.value?.length === 10;

const next = () => {
  if (!isExistsNextPage.value) return;
  page.value++;
  refreshPostData({ init: false });
};

const refresh = (dn: () => void) => refreshPostData({ init: true }).then(dn);
const filterTag = (tagName: string) => (selectTag.value = tagName);

const refreshPostData = async ({ init = false } = {}) => {
  if (init) page.value = 1;
  await refreshPost();
  if (init) {
    posts.value = _posts.value || [];
  } else {
    posts.value = [...posts.value, ...(_posts.value || [])];
  }
  isExistsNextPage.value = posts.value?.length === 10;
};

watch(
  () => searchWord.value,
  (v) => (selectQ.value = v)
);

watch([() => selectTag.value, () => selectQ.value], () =>
  refreshPostData({ init: true })
);
</script>

<template>
  <div>
    <q-pull-to-refresh @refresh="refresh">
      <PostTagList
        @click-tag="filterTag"
        :tags="tags"
        :active-tag-name="selectTag"
      />
      <q-separator spaced style="height: 8px" />
      <q-page class="q-mt-sm" style="min-height: 0">
        <PostListItem v-for="(post, i) in posts" :key="i" :post="post" />
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
