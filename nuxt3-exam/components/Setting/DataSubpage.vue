<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import SettingLayout from '@/layouts/SettingLayout.vue';
import { useSubpageStore } from '@/stores/subpage';
import stackArray from '@/data/stack.json';
import platformArray from '@/data/platform.json';
import DataCard from './DataCard.vue';

const subpageStore = useSubpageStore();
const { closeStackMain } = subpageStore;
const { stack } = storeToRefs(subpageStore);

const array = computed(() => (stack.value === 'stack' ? stackArray : platformArray));
const title = computed(() => (stack.value === 'stack' ? '팀로그의 기술 스택' : '허용가능한 플랫폼'));
</script>

<template>
  <SettingLayout :title="title" @back="closeStackMain">
    <q-scroll-area :visible="false" class="without-header">
      <q-page class="q-py-xs">
        <div v-for="json in array" :key="json.name">
          <DataCard :stack-json="json" />
        </div>
      </q-page>
    </q-scroll-area>
  </SettingLayout>
</template>

<style></style>
