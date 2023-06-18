<script setup lang="ts">
import { getImage } from "@/util/ImageUtil";

defineProps<{ mode: "SEARCH" | "LIST" }>();

const getContents = (mode: "SEARCH" | "LIST") => {
  switch (mode) {
    case "SEARCH":
      return "검색결과가 없습니다.";
    case "LIST":
      return "데이터가 없습니다.";
    default:
      return "";
  }
};
</script>
<template>
  <div class="column items-center justify-center q-pa-md">
    <span class="text-weight-bold text-subtitle1">{{ getContents(mode) }}</span>
    <div class="q-pa-md column items-center" style="height: 100%; width: 100%">
      <q-img
        :src="getImage('undraw_void.svg')"
        :fit="'fill'"
        style="width: 80%"
      />
    </div>
  </div>
</template>
