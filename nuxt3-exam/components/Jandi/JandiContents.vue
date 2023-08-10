<script setup lang="ts">
import { isTodayByString } from "@/plugin/dayjs";
import { DaysCount } from "@/types/common";

const props = defineProps<{ loading?: boolean; data: DaysCount<number>[] }>();
const countClass = (count: number) => `bg-green-${(count > 4 ? 4 : count) + 1}`;
const tooltip = ({ count, date }: DaysCount<number>) =>
  `${count === 0 ? "No" : count} posting on ${date} ${
    isTodayByString(date) ? "(Today)" : ""
  }`;
</script>
<template>
  <div>
    <div
      v-if="props.loading"
      class="column jandi-area justify-center items-center"
    >
      <q-spinner color="white" size="6em" :thickness="3" />
    </div>
    <div v-else class="column jandi-area">
      <div v-for="(v, i) in props.data" :key="i" class="jandi-wrap">
        <div class="jandi-month text-grey-2">{{ v.month }}</div>
        <div
          :class="{
            jandi: true,
            [countClass(v.count)]: true,
            'jandi-today': isTodayByString(v.date),
          }"
        >
          <q-tooltip>{{ tooltip(v) }}</q-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
