<script setup lang="ts">
defineProps<{
  weeklyAvgPost?: number;
  todayViews?: number;
  totalViews?: number;
}>();
</script>

<template>
  <q-item-label class="text-grey-5 q-pt-xs">
    <q-chip
      square
      outline
      dense
      color="green-4"
      class="views q-mr-xs"
      :label="'주간 게시물 ' + (weeklyAvgPost || 0) + '건'"
    />
    <q-chip
      square
      outline
      dense
      color="green-3"
      class="views q-mr-xs"
      :label="'today ' + (todayViews || 0)"
    />
    <q-chip
      square
      outline
      dense
      color="green-2"
      class="views"
      :label="'total ' + ((totalViews || 0) + (todayViews || 0))"
    />
  </q-item-label>
</template>
<style>
.views {
  font-size: 12px;
  opacity: 0.8;
  margin: 0;
  margin-right: 4px;
}
</style>
