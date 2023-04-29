<script setup lang="ts">
import { LinkWrap, OrderOption } from '@/types/common';
import { ref, watch } from 'vue';
import { usePostStore } from '@/stores/post';
import { storeToRefs } from 'pinia';

const postStore = usePostStore();
const { fetchCountGroupById } = postStore;
const { countPostGroupByLinkId, titleOfPostCounting, countOfPostCounting } = storeToRefs(postStore);

const props = defineProps<{ links: LinkWrap[] }>();
const orderOptions: OrderOption[] = [{ label: '3개월 동안 많이 작성한 블로그 순', value: 'asc', order: 1 }];
const currentOrder = ref(orderOptions[0]);
const series = ref([] as number[]);
let options = {
  dataLabels: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter(_: string, opts: any) {
      const { w, seriesIndex } = opts;
      return w.config.series[seriesIndex];
    },
  },
  legend: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter(val: string, opts: any) {
      const { w, seriesIndex } = opts;
      return `${val} (${w.globals.series[seriesIndex]})`;
    },
    position: 'top',
    fontSize: '14px',
    fontWeight: 400,
    labels: {
      colors: ['white'],
    },
    itemMargin: {
      horizontal: 5,
      vertical: 5,
    },
  },
  labels: [] as string[],
  plotOptions: {
    pie: {
      customScale: 1.3,
      offsetY: 70,
    },
  },
  stroke: {
    show: true,
    colors: ['#1D1D1D'],
    width: 4,
  },
  colors: ['#39d353', '#26a641', '#006d32', '#0e4429'],
};

watch(
  () => props.links,
  () => fetchCountGroupById(props.links),
  { immediate: true },
);

watch(
  () => countPostGroupByLinkId.value,
  () => {
    options = { ...options, labels: titleOfPostCounting.value };
    series.value = countOfPostCounting.value;
  },
);
</script>
<template>
  <q-select
    v-model="currentOrder"
    :options="orderOptions"
    label="Posting Count Ranking - Top 4"
    label-color="green-2"
    class="q-mb-md"
  >
    <template #before>
      <q-avatar square size="50px" font-size="25px" color="green-2" text-color="white" icon="donut_large" />
    </template>
  </q-select>
  <q-card class="bg-dark q-py-md">
    <template v-if="series.length > 0">
      <apexchart type="donut" :options="options" :series="series"></apexchart>
    </template>
  </q-card>
</template>
<style></style>
