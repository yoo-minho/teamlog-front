<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTagStore } from '@/stores/tag';
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps<{ name: string }>();

const route = useRoute();
const tagStore = useTagStore();
const { setCurrentTag, fetchTag } = tagStore;
const { currentTag, tags, tagsLoading } = storeToRefs(tagStore);
const router = useRouter();
const clickTag = (tag: string) => {
  setCurrentTag(tag);
  const name = String(route.name).includes('GroupDetail') ? 'Team' : props.name;
  router.replace({ name, query: tag === 'All' ? {} : { tag } });
  return;
};

onMounted(() => {
  setCurrentTag(String(route.query.tag || ''));
  fetchTag(props.name);
});
</script>

<template>
  <div>
    <div class="tag-scroll row q-mx-sm items-center wrap">
      <template v-if="tagsLoading">
        <q-skeleton v-for="n in 3" :key="n" :type="'QChip'" class="q-ma-xs" />
      </template>
      <template v-else>
        <q-chip
          v-for="(tag, i) in tags"
          :key="i"
          :class="{ active: currentTag === tag.name }"
          outline
          square
          clickable
          color="dark"
          style="opacity: 0.8"
          @click="clickTag(tag.name || '')"
        >
          <slot :tag-name="tag.name"></slot>
        </q-chip>
      </template>
    </div>
  </div>
</template>
<style lang="scss">
.tag-scroll {
  margin: 8px 12px;

  .q-scrollarea__content {
    display: flex;
  }
  .active {
    font-weight: bolder;
    color: $dark;
    background: $green-5 !important;
  }
}
</style>
