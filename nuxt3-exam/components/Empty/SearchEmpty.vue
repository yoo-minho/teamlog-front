<script setup lang="ts">
import { getImage } from '@/util/ImageUtil';

defineProps<{ noResult: boolean }>();
</script>
<template>
  <div class="column items-center justify-center q-pa-md">
    <span v-if="noResult">검색결과가 없습니다.</span>
    <span v-else><b>[검색 Tip]</b> '|'를 활용하면 OR 검색이 가능합니다.</span>
    <img :src="getImage('undraw_adventure.svg')" style="width: 100%; padding: 30px 60px 0 60px" />
  </div>
</template>
