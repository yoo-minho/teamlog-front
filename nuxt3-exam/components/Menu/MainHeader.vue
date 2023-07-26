<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import { TAB_LABEL } from "@/constants";
import { showBottomSheet } from "@/composables/useSnsBottomSheet";
import { showInstallBottomSheet } from "@/composables/useInstallBottomSheet";
import { showAuthDialog } from "@/composables/useAuthDialog";

const userStore = useUserStore();
const { searchWord, isExistsUser } = storeToRefs(userStore);
const [route, router] = [useRoute(), useRouter()];
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

const routeName = String(route.name || "team");
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
    const routeName = String(_routeName || "team");
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
      <template v-else>
        <q-toolbar-title class="name">{{ title }}</q-toolbar-title>
      </template>
      <template v-if="isSearchable">
        <q-btn :icon="seachIcon" flat round dense @click="toggleSearchMode()" />
      </template>
      <template v-if="isSortable">
        <q-btn icon="add" flat round dense @click="_openNewTeam()" />
      </template>
      <q-btn icon="share" flat round dense @click="showBottomSheet()" />
      <q-btn icon="menu" flat round dense @click="_openSettingMain" />
      <q-btn
        icon="get_app"
        flat
        round
        dense
        color="green-5 bounce"
        @click="showInstallBottomSheet()"
      />
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

.bounce {
  animation: motion 0.3s linear 0s infinite alternate;
  margin-top: 0;
}

@keyframes motion {
  0% {
    margin-top: -5px;
  }
  100% {
    margin-top: 5px;
  }
}
</style>
