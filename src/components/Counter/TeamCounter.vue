<script setup lang="ts">
defineProps<{
  weeklyAvgPost?: number;
  todayViews?: number;
  totalViews?: number;
}>();
</script>

<template>
  <div class="q-gutter-xs">
    <q-badge
      class="small-badge"
      outline
      color="green-6"
      :label="'주간 게시물 ' + (weeklyAvgPost || 0) + '건'"
    />
    <q-badge
      class="small-badge"
      outline
      color="green-5"
      :label="'today ' + (todayViews || 0)"
    />
    <q-badge
      class="small-badge"
      outline
      color="green-4"
      :label="'total ' + ((totalViews || 0) + (todayViews || 0))"
    />
  </div>
</template>
<style>
.small-badge {
  font-size: 11px;
}
</style>
