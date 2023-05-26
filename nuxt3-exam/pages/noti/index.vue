<script setup lang="ts">
import { getImage } from "@/util/ImageUtil";

definePageMeta({
  pageTransition: {
    mode: "out-in",
  },
  middleware(to, from) {
    const idx = (n: string) =>
      ["team", "blog", "post", "noti", "my"].findIndex((v) => v === n);
    if (!to.meta.pageTransition || to.meta.pageTransition === true) return;
    const toIdx = idx(String(to.name));
    const fromIdx = idx(String(from.name));
    console.log(to.name, from.name, toIdx, fromIdx);
    to.meta.pageTransition.name =
      fromIdx > toIdx ? "slide-left" : "slide-right";
  },
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
