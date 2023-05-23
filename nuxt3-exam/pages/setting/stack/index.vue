<script setup lang="ts">
import stackArray from "@/data/stack.json";
import DataCard from "../components/DataCard.vue";

definePageMeta({
  title: "팀로그의 기술 스택",
  backUrl: "/setting",
});
</script>

<template>
  <div>
    <template v-for="json in stackArray" :key="json.name">
      <DataCard :stack-json="json" />
    </template>
  </div>
</template>
