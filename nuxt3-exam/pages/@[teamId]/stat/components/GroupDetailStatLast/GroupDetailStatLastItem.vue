<script setup lang="ts">
import { computed, toRaw } from 'vue';
import { useGroupStore } from '@/stores/group';
import { LastPost } from '@/types/common';
import { skipBlogName } from '@/util/NameUtil';

const groupStore = useGroupStore();
const { currentGroup } = groupStore;

const medal = (i: number) => ['🥇', '🥈', '🥉'][i] || '';
const isRank = (i: number) => i < 3;

const props = defineProps<{ lastPost: LastPost; i: number }>();
const { linkId, dateString, agoString } = toRaw(props.lastPost);
const title = computed(() => currentGroup.links?.find(({ link }) => link.id === linkId)?.link.title);
const _isRank = computed(() => isRank(props.i));
</script>
<template>
  <q-item>
    <q-item-section class="col-8">
      <q-item-label class="text-weight-bold ellipsis text-subtitle2">
        {{ skipBlogName(title || '') }}
      </q-item-label>
      <q-item-label class="ellipsis text-grey-7">Last Posting Day</q-item-label>
      <q-item-label class="ellipsis text-grey-5">{{ dateString }}</q-item-label>
    </q-item-section>
    <q-item-section class="col-4">
      <q-item-label :class="{ 'text-green-5': _isRank, 'text-weight-bold': _isRank, 'text-subtitle2': true }">
        Rank {{ props.i + 1 }} {{ medal(props.i) }}
      </q-item-label>
      <q-item-label :class="_isRank ? 'text-green-7' : 'text-grey-7'">From Now</q-item-label>
      <q-item-label :class="_isRank ? 'text-green-4' : 'text-grey-5'">{{ agoString }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
