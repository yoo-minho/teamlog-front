<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import { usePostStore } from "@/stores/post";
import { skipBlogName } from "@/util/NameUtil";
import PostAPI from "@/api/postApi";
import LinkInfo from "~/components/Info/LinkInfo.vue";
import { Link } from "~/types/common";

const [groupStore, postStore] = [useGroupStore(), usePostStore()];
const { countPostGroupByLinkId } = storeToRefs(postStore);
const { currentGroup } = storeToRefs(groupStore);

//define
const getLink = (id: number) =>
  currentGroup.value.links
    ?.map(({ link }) => link)
    .find((l) => l.id === id) as Link;
const title = (id: number) => skipBlogName(getLink(id)?.title || "");
const linkIds = ref(currentGroup.value.links?.map(({ link: l }) => l.id) || []);

//created
const { data: _lot } = await PostAPI.findCountGroupById({ linkIds });
countPostGroupByLinkId.value = _lot.value || [];
</script>
<template>
  <div>
    <q-card class="">
      <q-card-section>
        <q-list separator>
          <template v-for="n in 5" :key="n">
            <template v-if="!!countPostGroupByLinkId[n - 1]">
              <q-item>
                <q-item-section>
                  <template v-if="n === 1">
                    <div class="text-center">
                      <q-item-label class="text-weight-bold text-subtitle1">
                        최다작성
                      </q-item-label>
                      <q-item-label>
                        <link-info
                          :link-data="getLink(countPostGroupByLinkId[0].linkId)"
                          :links="true"
                          :posts="false"
                        />
                      </q-item-label>
                    </div>
                  </template>
                  <q-item-label
                    class="row js-item"
                    :class="{ 'q-pt-md': n === 1 }"
                  >
                    <div class="col-2">{{ n }}</div>
                    <div class="col-6">
                      {{ title(countPostGroupByLinkId[n - 1].linkId) }}
                    </div>
                    <div
                      class="col-4 text-weight-bold text-subtitle2"
                      :class="{ 'text-green-4': n === 1 }"
                    >
                      {{ countPostGroupByLinkId[n - 1].count }}건
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </template>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>
<style scoped lang="scss">
.js-item {
  align-items: center;
  & > div {
    &:nth-child(1) {
      font-weight: bold;
    }
    &:nth-child(3) {
      text-align: right;
    }
  }
}
</style>
