<script setup lang="ts">
import { Link } from '@/types/common';
import { ref } from 'vue';
import LinkInfo from '../Info/LinkInfo.vue';
import { skipBlogName } from '@/util/NameUtil';
import { getFormatString } from '@/plugin/dayjs';

defineProps<{ link: Link; iconName: string }>();

const emits = defineEmits<{ (eventName: 'clickIcon'): void; (eventName: 'refreshIcon'): void }>();

const rotate = ref(false);
const xxx = async () => {
  rotate.value = true;
  emits('refreshIcon');
  setTimeout(() => (rotate.value = false), 400);
};

const emojiBundle = ['📕', '📊', '🔥', '🎯', '⚡', '🚀', '🏆', '📃', '💻', '📟', '📷', '🌍', '🌐'];
const randomDesc = `Need a description like '${emojiBundle
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)
  .slice(0, 3)
  .join(' ')}'`;
</script>

<template>
  <template v-if="iconName === 'clear'">
    <q-item clickable q-hoverable>
      <q-item-section side style="padding: 0">
        <LinkInfo :link-data="link" :links="true" :posts="false" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-weight-bold ellipsis text-subtitle2"> {{ link.title }} </q-item-label>
        <q-item-label class="ellipsis-2-lines text-grey-7">{{ link.description || randomDesc }}</q-item-label>
        <q-item-label class="ellipsis text-grey-5">{{ link.url }}</q-item-label>
      </q-item-section>
      <q-item-section class="justify-center cursor-pointer row" style="flex: auto">
        <q-icon :class="{ loading_arrow: rotate }" name="refresh" size="2em" @click="() => xxx()" />
        <q-icon name="clear" size="2em" @click="() => emits('clickIcon')" />
      </q-item-section>
    </q-item>
  </template>
  <template v-else-if="iconName === 'launch'">
    <q-item>
      <q-item-section side>
        <LinkInfo :link-data="link" :links="false" :posts="true" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-weight-bold ellipsis text-subtitle2">
          <q-icon name="launch" />
          {{ skipBlogName(link.title) }}
        </q-item-label>
        <q-item-label class="ellipsis-2-lines text-grey-7">{{ link.description || randomDesc }}</q-item-label>
        <q-item-label class="ellipsis text-grey-5">{{ link.url }}</q-item-label>
        <q-item-label class="text-grey-5">
          {{ getFormatString(link.lastPostCreatedAt, 'YYYY-MM-DD HH:mm (ddd)') }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </template>
  <template v-else> </template>
</template>
