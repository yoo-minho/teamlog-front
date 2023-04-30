<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import { usePostStore } from "@/stores/post";
import { skipBlogName } from "@/util/NameUtil";
import PostAPI from "@/api/postApi";

const [groupStore, postStore] = [useGroupStore(), usePostStore()];
const { countPostGroupByLinkId } = storeToRefs(postStore);
const { currentGroup } = storeToRefs(groupStore);

//define
const title = (id: number) =>
  skipBlogName(
    currentGroup.value.links?.map(({ link }) => link).find((l) => l.id === id)
      ?.title || ""
  );
const linkIds = ref(currentGroup.value.links?.map(({ link: l }) => l.id) || []);

//created
const { data: _lot } = await PostAPI.findCountGroupById({ linkIds });
countPostGroupByLinkId.value = _lot.value || [];
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
          Ranking to Write Lot Posts
        </q-item-label>
        <q-item-label class="text-grey-1">
          포스팅 많이 쓰는 기준으로 랭킹 (직전 3개월)
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
                {{ title(countPostGroupByLinkId[0].linkId) }}
              </q-item-label>
              <q-item-label class="text-grey-5 text-subtitle2">
                {{ countPostGroupByLinkId[0].count }}건
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-center">
              <q-item-label class="text-green-5 text-h5"> 🥈 </q-item-label>
              <q-item-label class="ellipsis text-subtitle2">
                {{ title(countPostGroupByLinkId[1].linkId) }}
              </q-item-label>
              <q-item-label class="text-grey-5">
                {{ countPostGroupByLinkId[0].count }}건
              </q-item-label>
            </q-item-section>
            <template v-if="countPostGroupByLinkId.length > 2">
              <q-item-section class="text-center">
                <q-item-label class="text-green-5 text-h6"> 🥉 </q-item-label>
                <q-item-label class="ellipsis text-subtitle2">
                  {{ title(countPostGroupByLinkId[2].linkId) }}
                </q-item-label>
                <q-item-label class="text-grey-5">
                  {{ countPostGroupByLinkId[2].count }}건
                </q-item-label>
              </q-item-section>
            </template>
            <template v-else>
              <q-item-section class="text-center">
                <q-item-label class="text-green-5 text-h6"> 🥉 </q-item-label>
                <q-item-label class="ellipsis text-subtitle2"> - </q-item-label>
                <q-item-label class="text-grey-5"> - </q-item-label>
              </q-item-section>
            </template>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>
