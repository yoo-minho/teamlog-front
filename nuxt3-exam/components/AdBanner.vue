<script setup lang="ts">
defineProps<{ color: string; textColor: string; banner: string; title: string; contents: string }>();
const emits = defineEmits<{ (eventName: 'clickBanner'): void }>();
</script>

<template>
  <q-item-label class="cursor-pointer row q-mx-sm items-center" @click="emits('clickBanner')">
    <div class="image_area row justify-center content-center">
      <q-avatar :color="color" :text-color="textColor" rounded size="64px">
        <div class="non-selectable" style="font-weight: bold">{{ banner }}</div>
      </q-avatar>
    </div>
    <q-item class="col q-px-sm">
      <q-item-section>
        <q-item-label class="text-weight-bolder row" style="font-size: 16px">
          <span>
            <span>{{ title }}</span>
          </span>
        </q-item-label>
        <q-item-label class="ellipsis-2-lines">{{ contents }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-item-label>
  <q-separator spaced />
</template>
