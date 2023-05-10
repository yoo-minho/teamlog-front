<script setup lang="ts">
import Jandi from "./components/Jandi/Jandi.vue";
import LastRanker from "./components/Ranker/LastRanker.vue";
import LotRanker from "./components/Ranker/LotRanker.vue";
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
<style lang="scss">
@charset "UTF-8";

.stat-area {
  .jandi {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    outline-offset: -1px;
  }
  .jandi-area {
    padding-top: 20px;
    height: 160px;
    width: 300px;
  }
  .jandi-wrap {
    width: auto;
    height: 14%;
  }
  .jandi-month {
    position: absolute;
    top: 12px;
  }
  .jandi-today {
    border-color: $grey-1;
  }
}
</style>
