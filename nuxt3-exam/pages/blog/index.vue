<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBlogStore } from "@/stores/blog";
import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import PostListSkeletonItem from "@/components/PostListSkeletonItem.vue";
import BlogTagList from "./components/BlogTagList.vue";
import BlogListItem from "@/components/BlogListItem.vue";
import BlogApi from "@/api/blogApi";
import { BLOG_TAG } from "~/constants";

definePageMeta({
  pageTransition: { mode: "out-in" },
  middleware: ["main-slide"],
});

const route = useRoute();
const blogStore = useBlogStore();
const { blogs } = storeToRefs(blogStore);
const { saveBlogs } = blogStore;
const page = ref(1);
const selectTag = ref(String(route.query.tag || "All"));
const isExistsNextPage = ref(false);

const tags = ref(BLOG_TAG.map((v) => ({ id: v.type, name: v.type })));
const { data: _blogs, refresh: refreshBlog } = await BlogApi.findAll({
  page: page,
  tag: selectTag,
});
blogs.value = _blogs.value || [];
isExistsNextPage.value = blogs.value?.length === 10;

const refreshBlogData = async ({ init = false } = {}) => {
  if (init) page.value = 1;
  await refreshBlog();
  saveBlogs(init, _blogs.value);
  isExistsNextPage.value = _blogs.value?.length === 10;
};

const next = () => {
  page.value++;
  refreshBlogData({ init: false });
};

const refresh = (dn: () => void) => refreshBlogData({ init: true }).then(dn);

const filterTag = (tagName: string) => {
  selectTag.value = tagName;
  refreshBlogData({ init: true });
};
</script>
<template>
  <div class="page">
    <q-pull-to-refresh @refresh="refresh">
      <BlogTagList
        :active-tag-name="selectTag"
        @click-tag="filterTag"
        :tags="tags"
      />
      <q-separator spaced />
      <q-page class="q-mt-sm" style="min-height: 0">
        <BlogListItem v-for="(blog, i) in blogs" :key="i" :link="blog" />
      </q-page>
      <ClientOnly>
        <template v-if="isExistsNextPage">
          <ScrollObserver @trigger-intersected="next">
            123123

            <PostListSkeletonItem />
          </ScrollObserver>
        </template>
      </ClientOnly>
    </q-pull-to-refresh>
  </div>
</template>
