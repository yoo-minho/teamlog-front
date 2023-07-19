<script setup lang="ts">
import { Group } from "@/types/common";
import { getFormatString } from "@/plugin/dayjs";

defineProps<{ groupData: Group }>();
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
    </q-item-section>
  </q-item>
</template>
