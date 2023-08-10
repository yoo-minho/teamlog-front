<script setup lang="ts">
import Jandi from "./components/Jandi/Jandi.vue";
import LastRanker from "./components/Ranker/LastRanker.vue";
import LotRanker from "./components/Ranker/LotRanker.vue";

definePageMeta({
  layout: "in-team",
  middleware: ["team-slide"],
});
</script>

<template>
  <q-item class="q-pa-none q-mt-sm" style="min-height: 0">
    <q-item-section>
      <div class="max-width">
        <div class="q-px-md q-pb-md q-mt-sm stat-area">
          <Jandi />
          <q-separator class="q-my-md" />
          <LotRanker />
          <q-separator class="q-my-md" />
          <LastRanker />
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>
