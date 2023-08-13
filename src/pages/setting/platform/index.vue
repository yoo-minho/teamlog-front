<script setup lang="ts">
import platformArray from "@/data/platform.json";
import DataCard from "../components/DataCard.vue";

definePageMeta({
  title: "허용가능한 플랫폼",
});
</script>

<template>
  <div>
    <template v-for="json in platformArray" :key="json.name">
      <DataCard :stack-json="json" />
    </template>
  </div>
</template>
