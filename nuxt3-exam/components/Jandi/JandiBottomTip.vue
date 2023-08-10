<script setup lang="ts">
const props = defineProps<{ count: number }>();
</script>
<template>
  <div class="column items-center" style="margin: 0 auto">
    <div class="row q-gutter-xs items-center q-mt-xs">
      <div class="text-grey-1">Less</div>
      <div class="jandi bg-green-1"></div>
      <div class="jandi bg-green-2"></div>
      <div class="jandi bg-green-3"></div>
      <div class="jandi bg-green-4"></div>
      <div class="jandi bg-green-5"></div>
      <div class="text-grey-1">More</div>
    </div>
    <div class="row q-gutter-xs items-center q-mt-xs">
      <div class="text-grey-1">
        {{ props.count }} posting in the last 3 months
      </div>
    </div>
  </div>
</template>
