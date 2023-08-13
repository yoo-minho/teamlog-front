<script setup lang="ts">
import PostAPI from "@/api/postApi";
import JandiContents from "@/components/Jandi/JandiContents.vue";
import JandiBottomTip from "@/components/Jandi/JandiBottomTip.vue";

const jandi = ref();
const _totalJandiCnt = ref(0);
const { data: _jandis, pending } = await PostAPI.countByDate();
watch(
  _jandis,
  () => {
    jandi.value = _jandis.value;
    const { totalJandiCnt } = useDayCount(jandi.value);
    _totalJandiCnt.value = totalJandiCnt;
  },
  { immediate: true }
);

definePageMeta({
  layout: "default",
  middleware: ["main-slide"],
});
</script>
<template>
  <q-item class="q-pa-none q-mt-sm" style="min-height: 0">
    <q-item-section>
      <div class="max-width">
        <div class="q-px-md q-pb-md q-mt-sm stat-area">
          <q-item-label
            class="text-weight-bolder q-mb-md"
            style="font-size: 20px"
          >
            팀로그의 누군가는 계속 포스팅하고 있습니다 ✍
          </q-item-label>
          <q-card>
            <q-card-section class="row jandi-zone">
              <JandiContents :loading="pending" :data="jandi" />
              <JandiBottomTip :count="_totalJandiCnt" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-item-section>
  </q-item>
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
