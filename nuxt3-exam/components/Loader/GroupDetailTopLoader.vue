<script setup lang="ts">
const loadingItem = [
  { width: '30%', height: '20px' },
  { width: '40%', height: '30px' },
  { width: '60%', height: '20px' },
];
</script>

<template>
  <div class="q-pt-md q-px-md row justify-between">
    <q-skeleton v-for="n in 2" :key="n" type="text" width="15%" height="20px" />
  </div>
  <div>
    <q-item>
      <q-item-section>
        <q-list>
          <q-item v-for="(v, i) in loadingItem" :key="i" class="q-pa-none row justify-center" style="min-height: 0">
            <q-skeleton type="text" :width="v.width" :height="v.height" />
          </q-item>
        </q-list>
      </q-item-section>
    </q-item>
  </div>
</template>
