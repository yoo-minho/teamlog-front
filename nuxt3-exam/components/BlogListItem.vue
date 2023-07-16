<script setup lang="ts">
import { Link } from "@/types/common";
import LinkCard from "@/components/Card/LinkCard.vue";
import { openUrl } from "@/utils/CommUtil";

defineProps<{ link: Link }>();
</script>

<template>
  <q-item-label class="cursor-pointer" @click="openUrl(link.url)">
    <LinkCard :link="link" icon-name="launch" />
  </q-item-label>
  <q-separator spaced />
</template>
<style lang="scss"></style>
