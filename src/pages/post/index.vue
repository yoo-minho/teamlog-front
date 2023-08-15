<script setup lang="ts">
import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import PostListItem from "@/components/Post/PostListItem.vue";
import PostListSkeletonItem from "@/components/Post/PostListSkeletonItem.vue";
import PostTagList from "./components/PostTagList.vue";
import PostApi from "@/api/postApi";
import { POST_TAG } from "@/constants";
import SearchEmpty from "@/components/Empty/SearchEmpty.vue";

const route = useRoute();
const page = ref(1);
const selectTag = ref(String(route.query.tag || "All"));
const selectTagVal = ref(String(route.query.tag || "All"));
const isExistsNextPage = ref(false);
const tags = ref(POST_TAG.map((v) => ({ id: v.label, name: v.label })));
const currentPosts = ref();
const response = await PostApi.findPosts({ page, tag: selectTagVal });
const { data: _posts, refresh: refreshPost, pending } = response;

watch(
  _posts,
  (newPosts) => {
    currentPosts.value = [
      ...(page.value === 1 ? [] : currentPosts.value || []),
      ...(newPosts || []),
    ];
    isExistsNextPage.value = newPosts?.length === 10;
  },
  { immediate: true }
);

const refreshPostData = async ({ init = false } = {}) => {
  page.value = (init ? 0 : page.value) + 1;
  await refreshPost();
};
const next = () => refreshPostData({ init: false });
const refresh = (dn: () => void) => refreshPostData({ init: true }).then(dn);
const filterTag = (tagName: string) => {
  selectTag.value = tagName;
  selectTagVal.value = POST_TAG.find((v) => v.label === tagName)?.value || "";
};
watch([selectTag], () => refreshPostData({ init: true }));

definePageMeta({
  layout: "default",
});
</script>
<template>
  <q-scroll-area style="height: calc(100vh - 100px)" :visible="false">
    <q-pull-to-refresh @refresh="refresh">
      <q-layout class="max-width">
        <q-page-container>
          <q-page>
            <PostTagList
              @click-tag="filterTag"
              :tags="tags"
              :active-tag-name="selectTag"
            />
            <q-separator spaced />
            <template v-if="pending && page === 1">
              <PostListSkeletonItem v-for="i in 12" :key="i" />
            </template>
            <template v-else>
              <template v-if="currentPosts.length > 0">
                <PostListItem
                  v-for="(post, i) in currentPosts"
                  :key="i"
                  :post="post"
                  :selected-tag="selectTagVal"
                />
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
            <q-page-scroller
              position="bottom-right"
              :scroll-offset="150"
              :offset="[18, 18]"
            >
              <q-btn fab icon="keyboard_arrow_up" color="green-5" />
            </q-page-scroller>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-pull-to-refresh>
  </q-scroll-area>
</template>
