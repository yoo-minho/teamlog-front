<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import { usePostStore } from "@/stores/post";
import { skipBlogName } from "@/utils/NameUtil";
import PostAPI from "@/api/postApi";

const [groupStore, postStore] = [useGroupStore(), usePostStore()];
const { lastPosts } = storeToRefs(postStore);
const { currentGroup } = storeToRefs(groupStore);

//define
const title = (id: number) =>
  skipBlogName(
    currentGroup.value.links?.map(({ link }) => link).find((l) => l.id === id)
      ?.title || ""
  );
const linkIds = ref(currentGroup.value.links?.map(({ link: l }) => l.id) || []);

//created
const { data: _lasts } = await PostAPI.findLast({ linkIds });
lastPosts.value = _lasts.value || [];
</script>
<template>
  <div>
    <q-item class="q-px-none">
      <q-item-section side>
        <q-avatar
          square
          size="50px"
          font-size="25px"
          color="green-4"
          text-color="white"
          icon="fiber_new"
        />
      </q-item-section>
      <q-item-section class="text-subtitle2">
        <q-item-label class="text-green-4">
          Ranking on Last Writing Date
        </q-item-label>
        <q-item-label class="text-grey-1">
          최근 포스팅 글을 기준으로 랭킹
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-card class="bg-dark">
      <q-card-section class="text-white">
        <q-list dark bordered separator>
          <q-item>
            <q-item-section class="text-center">
              <q-item-label class="text-green-5 text-h4"> 🥇 </q-item-label>
              <q-item-label class="text-weight-bold ellipsis text-h6">
                {{ title(lastPosts[0].linkId) }}
              </q-item-label>
              <q-item-label class="text-grey-5 text-subtitle2">
                {{ lastPosts[0].agoString }} / {{ lastPosts[0].dateString }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-center col-6">
              <q-item-label class="text-green-5 text-h5"> 🥈 </q-item-label>
              <q-item-label class="ellipsis text-subtitle2">
                {{ title(lastPosts[1].linkId) }}
              </q-item-label>
              <q-item-label class="text-grey-5">
                {{ lastPosts[1].agoString }}
              </q-item-label>
              <q-item-label
                class="ellipsis text-grey-5"
                style="font-size: 12px"
              >
                {{ lastPosts[1].dateString }}
              </q-item-label>
            </q-item-section>
            <template v-if="lastPosts.length > 2">
              <q-item-section class="text-center col-6">
                <q-item-label class="text-green-5 text-h6"> 🥉 </q-item-label>
                <q-item-label class="ellipsis text-subtitle2">
                  {{ title(lastPosts[2].linkId) }}
                </q-item-label>
                <q-item-label class="text-grey-5">
                  {{ lastPosts[2].agoString }}
                </q-item-label>
                <q-item-label
                  class="ellipsis text-grey-5"
                  style="font-size: 12px"
                >
                  {{ lastPosts[2].dateString }}
                </q-item-label>
              </q-item-section>
            </template>
            <template v-else>
              <q-item-section class="text-center col-6">
                <q-item-label class="text-green-5 text-h6"> 🥉 </q-item-label>
                <q-item-label class="ellipsis text-subtitle2"> - </q-item-label>
                <q-item-label class="text-grey-5"> - </q-item-label>
                <q-item-label
                  class="ellipsis text-grey-5"
                  style="font-size: 12px"
                >
                  -
                </q-item-label>
              </q-item-section>
            </template>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>
