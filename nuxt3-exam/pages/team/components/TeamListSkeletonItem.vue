<script setup lang="ts">
import TeamCounter from "@/components/Counter/TeamCounter.vue";
</script>
<template>
  <q-item-label class="q-mx-sm">
    <TeamCounter class="q-px-sm q-py-sm" />
    <q-item class="q-px-sm" style="overflow-x: hidden">
      <div v-for="i in 4" :key="i" class="q-mr-sm">
        <q-avatar
          color="black"
          text-color="white"
          rounded
          size="32px"
          class="shadow-1"
        >
          <div class="non-selectable"></div>
        </q-avatar>
      </div>
    </q-item>
    <q-item class="q-px-sm q-pt-sm">
      <q-item-section>
        <q-skeleton type="rect" width="35%" height="1.4rem" />
        <q-skeleton type="rect" width="80%" height="0.8rem" class="q-mt-xs" />
        <q-skeleton type="rect" width="20%" height="0.8rem" class="q-mt-sm" />
        <q-skeleton type="rect" width="40%" height="0.8rem" class="q-mt-xs" />
      </q-item-section>
    </q-item>
  </q-item-label>
  <q-separator spaced />
</template>
<style scope>
.image_area {
  width: 80px;
  height: 80px;
  margin: 4px 0 0 4px;
}
.image_item {
  margin: 0 4px 4px 0;
}
</style>
