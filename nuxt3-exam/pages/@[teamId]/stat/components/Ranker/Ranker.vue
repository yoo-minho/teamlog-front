<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupStore } from "@/stores/group";
import { skipBlogName } from "@/utils/NameUtil";
import LinkInfo from "~/components/Info/LinkInfo.vue";
import { Link } from "~/types/common";

const [groupStore] = [useGroupStore()];
const { currentGroup } = storeToRefs(groupStore);

//define
const getLink = (id: number) =>
  currentGroup.value.links
    ?.map(({ link }) => link)
    .find((l) => l.id === id) as Link;
const getLinkTitle = (id: number) => skipBlogName(getLink(id)?.title || "");

//created
defineProps<{
  title: string;
  data: { linkId: number; stat: string }[];
}>();
</script>
<template>
  <q-card>
    <q-card-section>
      <q-list>
        <template v-for="n in 5" :key="n">
          <template v-if="!!data[n - 1]">
            <template v-if="n === 1">
              <q-item class="text-center">
                <q-item-section>
                  <q-item-label class="text-weight-bold text-subtitle1">
                    {{ title }}
                  </q-item-label>
                  <q-item-label class="q-pt-sm">
                    <link-info
                      :link-data="getLink(data[0].linkId)"
                      :links="true"
                      :posts="false"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <q-item>
              <q-item-section>
                <q-item-label class="row js-item">
                  <div class="col-1">{{ n }}</div>
                  <div
                    class="col-8 ellipsis"
                    :class="{ 'text-green-4': n === 1 }"
                  >
                    {{ getLinkTitle(data[n - 1].linkId) }}
                  </div>
                  <div
                    class="col-3 text-weight-bold text-subtitle2"
                    :class="{ 'text-green-4': n === 1 }"
                  >
                    {{ data[n - 1].stat }}
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
          </template>
        </template>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<style scoped lang="scss">
.js-item {
  align-items: center;
  height: 32px;
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
