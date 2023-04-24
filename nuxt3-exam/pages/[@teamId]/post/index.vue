<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "~/stores/group";
import { Group } from "~/types/common";

const groupStore = useGroupStore();
const { currentGroup } = storeToRefs(groupStore);

const slots = useSlots();
defineProps<{ team: Group }>();
const route = useRoute();
// When accessing /posts/1, route.params.id will be 1
console.log(route.params.teamId);
</script>
<template>
  <div class="max-width">
    {{ currentGroup }}
  </div>
</template>
