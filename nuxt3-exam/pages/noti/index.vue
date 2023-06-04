<script setup lang="ts">
import { getImage } from "@/util/ImageUtil";

definePageMeta({
  pageTransition: { mode: "out-in" },
  middleware: ["main-slide"],
});
</script>
<template>
  <div class="column items-center justify-center q-pa-md">
    <span class="text-h6">푸시 기능을 준비중입니다!</span>
    <q-img
      :src="getImage('undraw_my_noti.svg')"
      style="width: 100%; padding: 30px 60px 0 60px"
    />
  </div>
</template>
