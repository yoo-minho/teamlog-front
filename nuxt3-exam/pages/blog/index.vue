<script setup lang="ts">
import BlogListSkeletonItem from "@/components/Blog/BlogListSkeletonItem.vue";
import BlogListItem from "@/components/Blog/BlogListItem.vue";
import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import BlogTagList from "./components/BlogTagList.vue";
import BlogApi from "@/api/blogApi";
import { BLOG_TAG } from "@/constants";

const route = useRoute();
const page = ref(1);
const selectTag = ref(String(route.query.tag || "All"));
const isExistsNextPage = ref(false);
const tags = ref(BLOG_TAG.map((v) => ({ id: v.type, name: v.type })));
const currentBlogs = ref();
const response = await BlogApi.findAll({ page, tag: selectTag });
const { data: _blogs, refresh: refreshBlog, pending } = response;

watch(
  _blogs,
  (newBlogs) => {
    currentBlogs.value = [
      ...(page.value === 1 ? [] : currentBlogs.value || []),
      ...(newBlogs || []),
    ];
    isExistsNextPage.value = newBlogs?.length === 10;
  },
  { immediate: true }
);

const refreshBlogData = async ({ init = false } = {}) => {
  page.value = (init ? 0 : page.value) + 1;
  await refreshBlog();
};

const next = () => refreshBlogData({ init: false });
const refresh = (dn: () => void) => refreshBlogData({ init: true }).then(dn);
const filterTag = (tagName: string) => (selectTag.value = tagName);
watch([selectTag], () => refreshBlogData({ init: true }));

definePageMeta({
  layout: "default",
  middleware: ["main-slide"],
});
</script>
<template>
  <q-pull-to-refresh @refresh="refresh">
    <BlogTagList
      :active-tag-name="selectTag"
      @click-tag="filterTag"
      :tags="tags"
    />
    <q-separator spaced />
    <q-page class="q-mt-sm" style="min-height: 0">
      <template v-if="pending && page === 1">
        <BlogListSkeletonItem v-for="i in 12" :key="i" />
      </template>
      <template v-else>
        <BlogListItem v-for="(blog, i) in currentBlogs" :key="i" :link="blog" />
        <ClientOnly>
          <template v-if="isExistsNextPage">
            <ScrollObserver @trigger-intersected="next">
              <BlogListSkeletonItem />
            </ScrollObserver>
          </template>
        </ClientOnly>
      </template>
    </q-page>
  </q-pull-to-refresh>
</template>
