<script setup lang="ts">
const props = defineProps<{ todayViews: number; totalViews: number }>();
</script>

<template>
  <div class="q-pt-md q-px-md row justify-between">
    <q-chip square outline dense color="dark" class="views q-mr-xs" :label="'today ' + props.todayViews" />
    <q-chip
      square
      outline
      dense
      color="green-4"
      class="views"
      :label="'total ' + (props.totalViews + props.todayViews)"
    />
  </div>
</template>
<style scope>
.views {
  font-size: 12px;
  opacity: 0.8;
}
</style>
