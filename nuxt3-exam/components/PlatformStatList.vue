<script setup lang="ts">
import { BlogType } from "@/types/common";
import { getImage } from "@/utils/ImageUtil";

defineProps<{ linkCountByPlatform: { _count: number; type: BlogType }[] }>();
</script>
<template>
  <q-chip
    v-for="(v, i) in linkCountByPlatform"
    :key="i"
    color="dark"
    text-color="white"
    size="16px"
  >
    <q-avatar size="24px">
      <q-img :src="getImage(`platform/${v.type.toLowerCase()}.png`)"></q-img>
    </q-avatar>
    <span>{{ v._count }}</span>
  </q-chip>
</template>

<style lang="scss" scoped></style>
