<script setup lang="ts">
import { getImage } from "@/util/ImageUtil";

definePageMeta({
  pageTransition: { mode: "out-in" },
  middleware: ["main-slide"],
});
</script>
<template>
  <div class="column items-center justify-center q-pa-md">
    <span class="text-weight-bold text-subtitle1">
      푸시 기능을 준비중입니다!
    </span>
    <div class="q-pa-md column items-center" style="height: 100%; width: 100%">
      <q-img
        :src="getImage('undraw_my_noti.svg')"
        :fit="'fill'"
        style="width: 80%"
      />
    </div>
  </div>
</template>
