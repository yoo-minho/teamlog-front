<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "~/stores/group";
import { usePostStore } from "@/stores/post";
import { skipBlogName } from "@/util/NameUtil";
import PostAPI from "@/api/postApi";

import GroupDetailStatJandiTip from "./GroupDetailStatJandiTip.vue";
import GroupDetailStatJandiBox from "./GroupDetailStatJandiBox.vue";
import GroupDetailStatJandiContents from "./GroupDetailStatJandiContents.vue";

const MMM = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const day = [0, 1, 2, 3, 4, 5, 6];

const postStore = usePostStore();
const { jandis } = storeToRefs(postStore);

const groupStore = useGroupStore();
const { currentGroup } = storeToRefs(groupStore);

const defaultOption = { label: "전체 (블로그별 필터 가능)", value: -1 };
const targetLinkIds = ref(
  (currentGroup.value.links || [])?.map(({ link }) => link.id)
);

const blogFilterSelected = ref(defaultOption);
const blogFilterOptions = computed(() => [
  defaultOption,
  ...(currentGroup.value.links || []).map(({ link }) => ({
    label: skipBlogName(link.title),
    value: link.id || -1,
  })),
]);

const { data: _jandis, refresh: refreshJandi } = await PostAPI.countByDate({
  linkIds: targetLinkIds,
});
jandis.value = _jandis.value || [];

const refreshJandiData = async (selected: { label: string; value: number }) => {
  targetLinkIds.value = (currentGroup.value.links || [])
    .map(({ link }) => link.id)
    .filter((l) => (selected.value === -1 ? true : l === selected.value));
  await refreshJandi();
  jandis.value = _jandis.value || [];
};

const [activeJandisCount, nextPostingDay, manyPostingMMM] = [
  ref(0), //활성화 잔디 카운트
  ref(""), //다음 포스팅까지
  ref(""), //포스팅 많은 요일
];
watch(
  () => jandis.value,
  (_jandi) => {
    const activeJandis = _jandi.filter(({ count: c }) => c > 0);
    if (activeJandis.length === 0) {
      activeJandisCount.value = 0;
      nextPostingDay.value = "-";
      manyPostingMMM.value = "-";
      return;
    }

    const add = (total: number, val: { count: number }) => total + val.count;
    const totalCnt = activeJandis.reduce(add, 0);
    activeJandisCount.value = totalCnt;
    nextPostingDay.value = Math.round((90 / totalCnt) * 100) / 100 + "일";
    const countTarget = (d: number) =>
      activeJandis.filter(({ day }) => day === d).length;
    const dayOfWeek = day
      .map((d) => ({ day: d, count: countTarget(d) }))
      .sort((x, y) => y.count - x.count);
    manyPostingMMM.value = MMM[dayOfWeek[0].day];
  },
  { immediate: true }
);
</script>
<template>
  <div>
    <q-select
      v-model="blogFilterSelected"
      :options="blogFilterOptions"
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
    <div class="row q-col-gutter-md q-mb-md">
      <GroupDetailStatJandiBox
        :label="'다음 포스팅까지'"
        :value="nextPostingDay"
      />
      <GroupDetailStatJandiBox
        :label="'포스팅 많은 요일'"
        :value="manyPostingMMM"
      />
    </div>
    <q-card class="bg-green-1">
      <q-card-section class="row jandi-zone">
        <GroupDetailStatJandiContents :data="jandis" />
        <GroupDetailStatJandiTip :count="activeJandisCount" />
      </q-card-section>
    </q-card>
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
