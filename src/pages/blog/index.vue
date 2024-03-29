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
const withTeam = ref(true);
const isExistsNextPage = ref(false);
const tags = ref(BLOG_TAG.map((v) => ({ id: v.type, name: v.type })));
const currentBlogs = ref();
const response = await BlogApi.findAll({ page, tag: selectTag, withTeam });
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
const changeWithTeamFilter = () => (withTeam.value = !withTeam.value);
watch([selectTag, withTeam], () => refreshBlogData({ init: true }));

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
            <BlogTagList
              :active-tag-name="selectTag"
              :is-with-team="withTeam"
              :tags="tags"
              @click-tag="filterTag"
              @click-with-team-filter="changeWithTeamFilter"
              @refresh="refreshBlogData"
            />
            <q-separator spaced />
            <template v-if="pending && page === 1">
              <BlogListSkeletonItem v-for="i in 12" :key="i" />
            </template>
            <template v-else>
              <template v-if="currentBlogs.length > 0">
                <BlogListItem
                  v-for="(blog, i) in currentBlogs"
                  :key="i"
                  :link="blog"
                />
                <ClientOnly>
                  <template v-if="isExistsNextPage">
                    <ScrollObserver @trigger-intersected="next">
                      <BlogListSkeletonItem />
                    </ScrollObserver>
                  </template>
                </ClientOnly>
              </template>
              <template v-else>
                <q-item-label class="q-mx-sm">
                  <q-item class="q-px-sm justify-center text-center">
                    <div>
                      <div class="text-subtitle2 q-pt-md">
                        당신의 블로그가 있나요?
                      </div>
                      <div class="text-weight-bold text-subtitle1 q-pb-md">
                        팀이 없어도 일단 등록해보세요!
                      </div>
                      <q-img
                        :src="getImage('undraw_project_team.svg')"
                        :fit="'fill'"
                      />
                    </div>
                  </q-item>
                </q-item-label>
              </template>
            </template>
            <q-page-scroller
              position="bottom-right"
              :scroll-offset="150"
              :offset="[18, 18]"
            >
              <q-btn
                fab
                icon="keyboard_arrow_up"
                color="green-3"
                area-label="scrollTop"
              />
            </q-page-scroller>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-pull-to-refresh>
  </q-scroll-area>
</template>
