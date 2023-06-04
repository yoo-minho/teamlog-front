<script setup lang="ts">
import { Link } from "@/types/common";
import LinkInfo from "../Info/LinkInfo.vue";
import { skipBlogName } from "@/util/NameUtil";
import { getFormatString } from "@/plugin/dayjs";

defineProps<{ link: Link; iconName: string }>();

const emits = defineEmits<{
  (eventName: "clickIcon"): void;
  (eventName: "refreshIcon", stopLoading: () => void): void;
}>();

const rotate = ref(false);
const xxx = async () => {
  rotate.value = true;
  emits("refreshIcon", () => (rotate.value = false));
};
const yyy = async () => {
  emits("clickIcon");
};
</script>

<template>
  <q-item>
    <q-item-section side>
      <LinkInfo :link-data="link" :links="false" :posts="true" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-weight-bold ellipsis text-subtitle2">
        <q-icon name="launch" />
        {{ skipBlogName(link.title) }}
      </q-item-label>
      <q-item-label class="ellipsis-2-lines text-grey-7">{{
        link.description || "Need a description!"
      }}</q-item-label>
      <q-item-label class="ellipsis text-grey-5">{{ link.url }}</q-item-label>
      <q-item-label class="text-grey-5">
        {{ getFormatString(link.lastPostCreatedAt, "YYYY-MM-DD HH:mm (ddd)") }}
      </q-item-label>
    </q-item-section>
    <q-item-section
      v-if="iconName === 'clear'"
      class="justify-center cursor-pointer row"
      style="flex: auto"
    >
      <q-icon
        :class="{ loading_arrow: rotate }"
        name="refresh"
        size="2em"
        @click="() => xxx()"
      />
      <q-icon name="clear" size="2em" @click="() => yyy()" />
    </q-item-section>
  </q-item>
</template>

<style>
.loading_arrow {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
