<script setup lang="ts">
import { toRaw } from "vue";

import { getImage } from "@/util/ImageUtil";
import { StackJson } from "@/types/common";

const props = defineProps<{ stackJson: StackJson }>();
const { label, version, description, path, url, githubStar } = toRaw(
  props.stackJson
);
const openUrl = (url: string) => window.open(url, "stack");
</script>

<template>
  <q-item>
    <q-item-section top avatar style="cursor: pointer" @click="openUrl(url)">
      <q-avatar rounded size="80px">
        <q-img :src="getImage(path)" style="object-fit: cover" />
      </q-avatar>
    </q-item-section>

    <q-item-section style="justify-content: flex-start">
      <q-item-label>{{ label }} {{ version }}</q-item-label>
      <q-item-label caption class="ellipsis-3-lines">
        {{ description }}
      </q-item-label>
    </q-item-section>

    <q-item-section v-if="githubStar" side top>
      <q-badge>{{ githubStar }}</q-badge>
    </q-item-section>
  </q-item>
</template>

<style></style>
