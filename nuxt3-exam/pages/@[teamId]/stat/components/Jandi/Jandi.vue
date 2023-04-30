<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import { usePostStore } from "@/stores/post";
import { skipBlogName } from "@/util/NameUtil";
import PostAPI from "@/api/postApi";

import JandiBox from "./JandiBox.vue";
import JandiContents from "./JandiContents.vue";
import JandiBottomTip from "./JandiBottomTip.vue";

const [groupStore, postStore] = [useGroupStore(), usePostStore()];
const { jandis } = storeToRefs(postStore);
const { currentGroup } = storeToRefs(groupStore);

const defaultOption = { label: "전체 (블로그별 필터 가능)", value: -1 };

const makeLinkIds = (selectedId: number) =>
  (currentGroup.value.links || [])
    ?.map(({ link }) => link.id)
    .filter((id) =>
      selectedId === defaultOption.value ? true : id === selectedId
    );

const linkIds = ref(makeLinkIds(defaultOption.value));

const currentFilter = ref(defaultOption);
const filterOptions = computed(() => [
  defaultOption,
  ...(currentGroup.value.links || []).map(({ link }) => ({
    label: skipBlogName(link.title),
    value: link.id || -1,
  })),
]);

const { data: _jandis, refresh } = await PostAPI.countByDate({ linkIds });
jandis.value = _jandis.value || [];

const refreshJandiData = async (selected: { value: number }) => {
  linkIds.value = makeLinkIds(selected.value);
  await refresh();
  jandis.value = _jandis.value || [];
};

const [totalJandiCnt, nextPostDay, manyPostMMM] = [ref(0), ref("-"), ref("-")];
watch(
  () => jandis.value,
  (_jandi) => {
    const MMM = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = [0, 1, 2, 3, 4, 5, 6];

    const activeJandis = _jandi.filter(({ count: c }) => c > 0);
    if (activeJandis.length === 0) return;

    //calculate
    const add = (total: number, val: { count: number }) => total + val.count;
    const totalCnt = activeJandis.reduce(add, 0);
    const countTarget = (d: number) =>
      activeJandis.filter(({ day }) => day === d).length;
    const dayOfWeek = day
      .map((d) => ({ day: d, count: countTarget(d) }))
      .sort((x, y) => y.count - x.count);

    //setting
    totalJandiCnt.value = totalCnt;
    nextPostDay.value = Math.round((90 / totalCnt) * 100) / 100 + "일";
    manyPostMMM.value = MMM[dayOfWeek[0].day];
  },
  { immediate: true }
);
</script>
<template>
  <div>
    <q-select
      v-model="currentFilter"
      :options="filterOptions"
      label="Posting Graph By"
      label-color="green-4"
      class="q-mb-md"
      @update:model-value="refreshJandiData"
    >
      <template #before>
        <q-avatar
          square
          size="50px"
          font-size="25px"
          color="green-4"
          text-color="white"
          icon="grass"
        />
      </template>
    </q-select>
    <q-card class="bg-green-1">
      <q-card-section class="row jandi-zone">
        <JandiContents :data="jandis" />
        <JandiBottomTip :count="totalJandiCnt" />
      </q-card-section>
    </q-card>
    <div class="row q-col-gutter-md q-mt-none">
      <JandiBox :label="'다음 포스팅까지'" :value="nextPostDay" />
      <JandiBox :label="'포스팅 많은 요일'" :value="manyPostMMM" />
    </div>
  </div>
</template>

<style scoped>
.jandi-zone {
  justify-content: center;
}

@media (max-width: 400px) {
  .jandi-zone {
    justify-content: end;
    overflow-x: scroll;
  }
}
</style>
