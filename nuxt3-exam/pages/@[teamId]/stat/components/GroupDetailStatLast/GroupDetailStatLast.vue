<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePostStore } from '@/stores/post';
import { LinkWrap, OrderType, OrderOption } from '@/types/common';
import GroupDetailStatLastItem from './GroupDetailStatLastItem.vue';

const postStore = usePostStore();
const { fetchLastPosts } = postStore;
const { lastPosts, lastLoading } = storeToRefs(postStore);
const props = defineProps<{ links: LinkWrap[] }>();
const orderOptions: OrderOption[] = [
  { label: '최근 작성한 블로그 순', value: 'asc', order: 1 },
  { label: '오래전 작성한 블로그 순', value: 'desc', order: -1 },
];
const currentOrder = ref(orderOptions[0]);
const sortPost = (order: OrderType = 1) => fetchLastPosts(props.links, order);

watch(
  () => props.links,
  () => sortPost(),
  { immediate: true },
);
watch(
  () => currentOrder.value,
  (json: { order: OrderType }) => sortPost(json.order),
);
</script>
<template>
  <div>
    <q-select
      v-model="currentOrder"
      :options="orderOptions"
      label="Last Posting Day Ranking - Top 4"
      label-color="green-3"
      class="q-mb-md"
    >
      <template #before>
        <q-avatar square size="50px" font-size="25px" color="green-3" text-color="white" icon="fiber_new" />
      </template>
    </q-select>
    <q-card class="bg-dark">
      <q-card-section class="text-white">
        <div v-if="lastLoading" class="text-center">
          <q-spinner color="white" size="3em" />
        </div>
        <div v-else>
          <q-list dark bordered separator>
            <GroupDetailStatLastItem v-for="(v, i) in lastPosts.slice(0, 4)" :key="i" :last-post="v" :i="i" clickable />
          </q-list>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
