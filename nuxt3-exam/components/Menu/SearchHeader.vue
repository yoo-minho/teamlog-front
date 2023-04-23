<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { usePostStore } from "@/stores/post";
import { useGroupStore } from "@/stores/group";

const postStore = usePostStore();
const { postLoading } = storeToRefs(postStore);
// const { fetchSearchPosts } = postStore;
const groupStore = useGroupStore();
const { currentGroup } = storeToRefs(groupStore);
const router = useRouter();
const searchWord = ref();

function fetchSearchPosts() {}
</script>

<template>
  <q-header bordered class="bg-primary text-white max-width">
    <q-toolbar>
      <q-btn
        icon="keyboard_backspace"
        flat
        round
        dense
        @click="() => router.go(-1)"
      />
      <q-chip
        v-if="currentGroup.title"
        style="width: 7.5rem; color: white"
        color="green-4"
      >
        <span class="q-mr-xs">in</span
        ><q-item-label class="ellipsis">{{ currentGroup.title }}</q-item-label>
      </q-chip>
      <q-input
        v-model="searchWord"
        placeholder="포스트 검색"
        type="text"
        dense
        class="search-input-wrap q-ml-sm"
        color="white"
        style="width: 100%"
        label-color="white"
        clearable
        :input-class="'search-input'"
        :loading="postLoading"
        debounce="500"
        @update:model-value="fetchSearchPosts()"
      >
        <template #append>
          <q-btn
            icon="search"
            color="white"
            flat
            dense
            @click="fetchSearchPosts()"
          />
        </template>
      </q-input>
    </q-toolbar>
  </q-header>
</template>

<style scope lang="scss">
.search-input-wrap {
  & button {
    color: white;
  }
}
.search-input {
  color: white;
  font-size: 1rem;
}
</style>
