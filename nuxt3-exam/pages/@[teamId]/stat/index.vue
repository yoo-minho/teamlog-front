<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import GroupDetailStatLast from "./components/GroupDetailStatLast/GroupDetailStatLast.vue";
import GroupDetailStatJandi from "./components/GroupDetailStatJandi/GroupDetailStatJandi.vue";
import GroupDetailStatDonut from "./components/GroupDetailStatDonut.vue";

const groupStore = useGroupStore();
const { currentGroup } = storeToRefs(groupStore);
</script>

<template>
  <q-item class="q-pa-none q-mt-sm" style="min-height: 0">
    <q-item-section>
      <div class="max-width">
        <div class="q-px-md q-pb-md q-mt-sm stat-area">
          <GroupDetailStatJandi :links="currentGroup?.links || []" />

          <q-separator class="q-my-md" />

          <!-- <GroupDetailStatLast :links="currentGroup?.links || []" />

          <q-separator class="q-my-md" />

          <GroupDetailStatDonut :links="currentGroup?.links || []" /> -->
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>
<style lang="scss">
@import "./styles/_group-detail-stat.scss";
</style>
