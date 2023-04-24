<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Group } from "@/types/common";
import { getFormatString } from "@/plugin/dayjs";
import { usePostStore } from "@/stores/post";

defineProps<{ groupData: Group }>();

const postStore = usePostStore();
const { scrapLoading } = storeToRefs(postStore);
</script>

<template>
  <q-item class="column" style="padding: 0">
    <q-item-section class="text-center">
      <q-item-label class="text-weight-bold text-green-4"
        >@{{ groupData.domain }}</q-item-label
      >
      <q-item-label class="text-h6 text-weight-bolder">{{
        groupData.title
      }}</q-item-label>
      <q-item-label style="white-space: pre-wrap">{{
        groupData.description
      }}</q-item-label>
      <template v-if="scrapLoading">
        <q-linear-progress
          dark
          rounded
          indeterminate
          color="green-4"
          class="q-mt-sm"
        />
        <q-linear-progress dark rounded query color="green-2" class="q-mt-sm" />
      </template>
      <template v-else>
        <div class="q-mt-sm">
          <q-item-label class="text-grey-5">
            {{
              getFormatString(
                groupData.lastPostCreatedAt,
                "YYYY-MM-DD HH:mm (ddd)"
              )
            }}
          </q-item-label>
        </div>
      </template>
    </q-item-section>
  </q-item>
</template>
