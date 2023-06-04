<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import { showBottomSheet } from "@/hooks/useSnsBottomSheeet";
import { TAB_LABEL } from "@/constants";
import { showOrderBottomSheet } from "~/hooks/useOrderBottomSheet";
import { showAuthDialog } from "~/hooks/useAuthDialog";

const groupStore = useGroupStore();
const { groupSort } = storeToRefs(groupStore);
const userStore = useUserStore();
const { searchWord, isExistsUser } = storeToRefs(userStore);

const router = useRouter();
const route = useRoute();

const _openSettingMain = () => router.push({ name: "setting" });
const _openNewTeam = () => {
  if (isExistsUser.value) {
    router.push({ path: "/new/team" });
    return;
  }
  showAuthDialog({ to: "/new/team" });
};

const keywordRef = ref();
watch(
  () => keywordRef.value,
  (v) => {
    if (!v) return;
    const el = keywordRef.value.getNativeElement();
    el.addEventListener("input", (e: InputEvent) => {
      const eventTarget = e.target as HTMLInputElement;
      postSearhWord.value = eventTarget.value;
      router.push({
        path: "post",
        query: { ...route.query, q: eventTarget.value },
      });
    });
  }
);

const showOrderBS = () => {
  showOrderBottomSheet({
    order: groupSort.value,
    okCallback: (v: string) => (groupSort.value = v),
  });
};

const routeName = String(route.name);
const title = ref(TAB_LABEL[routeName] || "팀로그");
const isSortable = ref(routeName === "team");
const isSearchable = ref(routeName === "post");
const postSearhWord = ref(String(route.query.q || ""));
const isPostSearchMode = ref("" !== postSearhWord.value);
const seachIcon = computed(() => (isPostSearchMode.value ? "close" : "search"));

const toggleSearchMode = () => {
  isPostSearchMode.value && (postSearhWord.value = "");
  isPostSearchMode.value = !isPostSearchMode.value;
};

watch(
  () => postSearhWord.value,
  (v) => (searchWord.value = v)
);

watch(
  () => route.name,
  (_routeName) => {
    const routeName = String(_routeName);
    title.value = TAB_LABEL[routeName] || "팀로그";
    isSortable.value = routeName === "team";
    isSearchable.value = routeName === "post";
    postSearhWord.value = "";
    isPostSearchMode.value = false;
  }
);
</script>
<template>
  <q-header bordered class="text-white max-width">
    <q-toolbar>
      <q-input
        v-if="isSearchable && isPostSearchMode"
        ref="keywordRef"
        v-model="postSearhWord"
        type="search"
        bg-color="grey-2"
        dense
        rounded
        maxlength="20"
        style="flex: 1"
        :input-style="{ fontSize: '1rem' }"
        class="super-small"
        :placeholder="`'${title}'에서 검색`"
        autofocus
      >
        <template #prepend>
          <q-icon name="search" class="q-ma-sm" />
        </template>
      </q-input>
      <q-toolbar-title v-else class="name">{{ title }}</q-toolbar-title>
      <template v-if="isSearchable">
        <q-btn :icon="seachIcon" flat round dense @click="toggleSearchMode()" />
      </template>
      <template v-if="isSortable">
        <q-btn icon="add" flat round dense @click="_openNewTeam()" />
      </template>
      <template v-if="isSortable">
        <q-btn icon="filter_alt" flat round dense @click="showOrderBS" />
      </template>
      <q-btn icon="share" flat round dense @click="showBottomSheet()" />
      <q-btn icon="menu" flat round dense @click="_openSettingMain" />
    </q-toolbar>
  </q-header>
</template>

<style scope lang="scss">
.name {
  align-items: center;
  color: white;
  font-size: 20px;
  margin-left: 4px;
  font-weight: bold;
}

.super-small.q-field--dense {
  margin: 0 8px;

  .q-field__control {
    border-radius: 16px;
    height: 32px !important;
  }

  .q-field__marginal {
    padding: 0;
    height: 32px !important;
  }
}
</style>
