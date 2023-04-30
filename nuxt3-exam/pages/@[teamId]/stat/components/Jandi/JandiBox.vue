<script setup lang="ts">
const props = defineProps<{
  loading?: boolean;
  label: string;
  value: string;
}>();
</script>
<template>
  <div class="col-6">
    <q-card class="bg-green-1">
      <q-card-section class="column text-white justify-center items-center">
        <div style="font-size: 12px">{{ props.label }}</div>
        <div v-if="loading" class="text-h5">
          <q-spinner color="white" size="1.2em" />
        </div>
        <div v-else class="text-h5">{{ props.value }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>
