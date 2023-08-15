<script setup lang="ts">
import PostAPI from "@/api/postApi";
import JandiContents from "@/components/Jandi/JandiContents.vue";
import JandiBottomTip from "@/components/Jandi/JandiBottomTip.vue";
import { BLOG_TAG } from "@/constants";
import GroupApi from "@/api/groupApi";

const jandi = ref();
const teamCounter = ref(0);
const blogCounter = ref(0);
const postCounter = ref(0);
const _totalJandiCnt = ref(0);

const getLabel = (type: string) =>
  BLOG_TAG.find((v) => v.type === type)?.label || "All";

const { data: _counts } = await GroupApi.count();
watch(
  _counts,
  (newCounts) => {
    const teamCounterAnimate = () => {
      if (teamCounter.value >= (newCounts?.groupCount || 0)) return;
      teamCounter.value++;
      requestAnimationFrame(teamCounterAnimate);
    };
    const blogCounterAnimate = () => {
      const max = newCounts?.linkCount || 0;
      if (blogCounter.value >= max) return;
      blogCounter.value = blogCounter.value + 5;
      if (max < blogCounter.value) blogCounter.value = max;
      requestAnimationFrame(blogCounterAnimate);
    };
    const postCounterAnimate = () => {
      const max = newCounts?.postCount || 0;
      if (postCounter.value >= max) return;
      postCounter.value = postCounter.value + 100;
      if (max < postCounter.value) postCounter.value = max;
      requestAnimationFrame(postCounterAnimate);
    };
    setTimeout(() => {
      if (!window?.requestAnimationFrame) return;
      requestAnimationFrame(teamCounterAnimate);
      requestAnimationFrame(blogCounterAnimate);
      requestAnimationFrame(postCounterAnimate);
    }, 0);
  },
  { immediate: true }
);

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
});
</script>
<template>
  <q-scroll-area style="height: calc(100vh - 100px)" :visible="false">
    <q-list>
      <div>
        <q-item-label header class="q-pb-sm">누적 카운트</q-item-label>
        <div class="row q-px-md q-mb-md">
          <div class="col-4">
            <div class="text-bold text-h6 counter">
              {{ teamCounter?.toLocaleString() }}
            </div>
            팀
          </div>
          <div class="col-4">
            <div class="text-bold text-h6">
              {{ blogCounter?.toLocaleString() }}
            </div>
            블로그
          </div>
          <div class="col-4">
            <div class="text-bold text-h6">
              {{ postCounter?.toLocaleString() }}
            </div>
            포스트
          </div>
        </div>
      </div>
      <q-separator spaced />
      <div>
        <q-item-label header class="platform-area">
          플랫폼 분포
          <q-chip size="12px" clickable @click="navigateTo('setting/platform')">
            허용가능한 블로그?
          </q-chip>
        </q-item-label>
        <div class="row q-px-md q-mb-md">
          <q-chip
            v-for="(tag, i) in _counts?.linkCountByPlatform"
            :key="i"
            outline
            square
            clickable
            color="dark"
            style="opacity: 0.8"
          >
            <q-avatar size="18px">
              <q-img
                :src="getImage(`platform/${tag.type?.toLowerCase()}.png`)"
                :no-transition="true"
              />
            </q-avatar>
            {{ getLabel(tag.type) }}
            <div class="text-bold q-ml-sm">{{ tag._count }}</div>
          </q-chip>
        </div>
      </div>
      <q-separator spaced />
      <q-item class="q-pa-none q-mt-sm" style="min-height: 0">
        <q-item-section>
          <div class="max-width">
            <q-item-label header class="q-pb-sm">모든 이들의 잔디</q-item-label>
            <div class="q-px-md q-pb-md q-mt-sm stat-area">
              <q-item-label
                class="text-weight-bolder q-mb-md"
                style="font-size: 16px; font-style: italic"
              >
                "팀로그의 누군가는 계속 포스팅하고 있습니다 ✍"
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
      <q-separator spaced />
    </q-list>
  </q-scroll-area>
</template>
<style scope>
.platform-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
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
