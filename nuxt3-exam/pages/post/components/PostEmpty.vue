<script setup lang="ts">
import { getImage } from '@/util/ImageUtil';
</script>
<template>
  <div class="column items-center justify-center q-pa-md">
    <span class="text-h6">데이터가 없습니다</span>
    <img :src="getImage('undraw_adventure.svg')" style="width: 100%; padding: 30px 60px 0 60px" />
  </div>
</template>
