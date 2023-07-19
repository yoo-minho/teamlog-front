<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import { usePostStore } from "@/stores/post";
import { skipBlogName } from "@/utils/NameUtil";
import PostAPI from "@/api/postApi";

import JandiBox from "./JandiBox.vue";
import JandiContents from "./JandiContents.vue";
import JandiBottomTip from "./JandiBottomTip.vue";
import { DaysCount } from "~/types/common";

const MMM = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const day = [0, 1, 2, 3, 4, 5, 6];
const add = (total: number, val: { count: number }) => total + val.count;
const active = (arr: DaysCount[]) => arr.filter((v) => v.count > 0);
const targetCount = (arr: DaysCount[], day: number) =>
  arr.filter((v) => v.day === day).length;

const [groupStore, postStore] = [useGroupStore(), usePostStore()];
const { jandis } = storeToRefs(postStore);
const { currentGroup, currentGroupLinkIds } = storeToRefs(groupStore);

const defaultValue = -1;
const defaultOption = {
  label: "전체 (블로그별 필터 가능)",
  value: defaultValue,
};

const makeLinkIds = (selectedId: number) =>
  currentGroupLinkIds.value.filter((id) =>
    selectedId === defaultValue ? true : id === selectedId
  );

const linkIds = ref(makeLinkIds(defaultValue));
const [totalJandiCnt, nextPostDay, manyPostMMM] = [ref(0), ref("-"), ref("-")];

const currentFilter = ref(defaultOption);
const filterOptions = computed(() => [
  defaultOption,
  ...(currentGroup.value.links || []).map(({ link }) => ({
    label: skipBlogName(link.title),
    value: link.id || -1,
  })),
]);

const {
  data: _jandis,
  refresh,
  pending,
} = await PostAPI.countByDate({ linkIds });

watch(
  _jandis,
  () => {
    jandis.value = _jandis.value || [];

    const activeJandis = active(jandis.value);
    if (activeJandis.length === 0) return;

    //calculate
    const dayOfWeek = day
      .map((d) => ({ day: d, count: targetCount(activeJandis, d) }))
      .sort((x, y) => y.count - x.count);

    //setting
    totalJandiCnt.value = activeJandis?.reduce(add, 0) || 0;
    nextPostDay.value =
      Math.round((90 / totalJandiCnt.value) * 100) / 100 + "일";
    manyPostMMM.value = MMM[dayOfWeek[0].day];
  },
  { immediate: true }
);

const refreshJandiData = async (selected: { value: number }) => {
  linkIds.value = makeLinkIds(selected.value);
  await refresh();
  jandis.value = _jandis.value || [];
};
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
        <JandiContents :loading="pending" :data="jandis" />
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
