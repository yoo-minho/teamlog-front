<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBlogStore } from "@/stores/blog";
import { useTagStore } from "@/stores/tag";
import { ref, watch } from "vue";
import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import PostListSkeletonItem from "@/components/PostListSkeletonItem.vue";
import BlogListItem from "@/components/BlogListItem.vue";
import BlogTagList from "./components/BlogTagList.vue";

const blogStore = useBlogStore();
const { fetchBlogs } = blogStore;
const { blogs, blogsLoading } = storeToRefs(blogStore);
const tagStore = useTagStore();
const { currentTag } = storeToRefs(tagStore);

const page = ref(1);

const loadMore = async (el: Element) => {
  const existsPosts = await fetchBlogs(page.value);
  if (existsPosts) {
    page.value++;
  } else {
    el.innerHTML = "";
  }
};

watch(
  () => currentTag.value,
  () => {
    blogsLoading.value = true;
    page.value = 1;
    fetchBlogs();
    page.value++;
  },
  { immediate: true }
);

const refresh = async (done: () => void) => {
  blogsLoading.value = true;
  page.value = 1;
  await fetchBlogs();
  page.value++;
  done();
};
</script>

<template>
  <NuxtLayout name="main" @pull2refresh="refresh">
    <BlogTagList />
    <template v-if="blogsLoading && blogs.length === 0">
      <PostListSkeletonItem v-for="i in 10" :key="i" />
    </template>
    <template v-else>
      <q-page class="q-mt-sm">
        <div class="max-width">
          <BlogListItem v-for="(blog, i) in blogs" :key="i" :link="blog" />
          <ScrollObserver
            v-if="blogs.length >= 10"
            @trigger-intersected="loadMore"
          >
            <PostListSkeletonItem />
          </ScrollObserver>
        </div>
      </q-page>
    </template>
  </NuxtLayout>
</template>
