<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTeamStore } from "@/stores/team";
import { skipBlogName } from "@/utils/NameUtil";
import PostAPI from "@/api/postApi";

import JandiContents from "@/components/Jandi/JandiContents.vue";
import JandiBottomTip from "@/components/Jandi/JandiBottomTip.vue";

const defaultValue = -1;
const defaultOption = {
  label: "전체 (블로그별 필터 가능)",
  value: defaultValue,
};
const teamStore = useTeamStore();
const { currentTeam, currentTeamLinkIds } = storeToRefs(teamStore);
const makeLinkIds = (selectedId: number) =>
  currentTeamLinkIds.value.filter((id) =>
    selectedId === defaultValue ? true : id === selectedId
  );

const jandis = ref();
const linkIds = ref(makeLinkIds(defaultValue));
const _totalJandiCnt = ref(0);
const _manyPostMMM = ref("-");
const currentFilter = ref(defaultOption);
const filterOptions = computed(() => [
  defaultOption,
  ...(currentTeam.value.links || []).map(({ link }) => ({
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
    const { totalJandiCnt, manyPostMMM } = useDayCount(jandis.value);
    _totalJandiCnt.value = totalJandiCnt;
    _manyPostMMM.value = manyPostMMM;
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
    <q-card>
      <q-card-section class="row jandi-zone">
        <JandiContents :loading="pending" :data="jandis" />
        <JandiBottomTip :count="_totalJandiCnt" />
      </q-card-section>
    </q-card>
  </div>
  <q-item-label class="text-grey-5 q-mt-md">
    <q-chip
      square
      outline
      dense
      color="green-1"
      class="views q-mr-xs"
      :label="`#${_manyPostMMM}요일에포스팅많아`"
    />
  </q-item-label>
</template>

<style lang="scss">
@charset "UTF-8";

.jandi-zone {
  justify-content: center;
}

@media (max-width: 400px) {
  .jandi-zone {
    justify-content: end;
    overflow-x: scroll;
  }
}

.stat-area {
  .jandi {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(27, 31, 35, 0.06);
    border-radius: 4px;
    outline-offset: -1px;
  }
  .jandi-area {
    padding-top: 20px;
    height: 160px;
    width: 300px;
  }
  .jandi-wrap {
    width: auto;
    height: 14%;
  }
  .jandi-month {
    position: absolute;
    top: 12px;
  }
  .jandi-today {
    border-color: $grey-1;
  }
}
</style>
