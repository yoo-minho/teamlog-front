<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePostStore } from "@/stores/post";
import { useGroupStore } from "~/stores/group";

import GroupDetailPostLoader from "@/components/Loader/GroupDetailPostLoader.vue";
import ScrollObserver from "@/components/Observer/ScrollObserver.vue";
import PostApi from "@/api/postApi";

const postStore = usePostStore();
const { posts } = storeToRefs(postStore);

const groupStore = useGroupStore();
const { currentGroup } = storeToRefs(groupStore);

const page = ref(1);
const isExistsNextPage = ref(false);

const { data: _posts, refresh: refreshPost } = await PostApi.searchPosts({
  page: page,
  links: currentGroup.value.links,
});
posts.value = _posts.value || [];
isExistsNextPage.value = posts.value?.length === 10;

const next = () => {
  if (!isExistsNextPage.value) return;
  page.value++;
  refreshPostData({ init: false });
};

const refresh = (dn: () => void) => refreshPostData({ init: true }).then(dn);

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
</script>
<template>
  <div class="max-width">
    <q-pull-to-refresh @refresh="refresh" class="q-mt-xs">
      <PostListItem v-for="(post, i) in posts" :key="i" :post="post" />
      <ClientOnly>
        <template v-if="isExistsNextPage">
          <ScrollObserver @trigger-intersected="next">
            <GroupDetailPostLoader />
          </ScrollObserver>
        </template>
      </ClientOnly>
    </q-pull-to-refresh>
  </div>
</template>
<style scoped>
.scroller {
  height: 100%;
}
</style>
