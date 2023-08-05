<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTeamStore } from "@/stores/team";
import { skipBlogName } from "@/utils/NameUtil";
import LinkInfo from "@/components/Info/LinkInfo.vue";
import { RankerStat, Link } from "@/types/common";

const teamStore = useTeamStore();
const { currentTeam } = storeToRefs(teamStore);

//define
const getLink = (id: number) =>
  currentTeam.value.links
    ?.map(({ link }) => link)
    .find((l) => l.id === id) as Link;
const getLinkTitle = (id: number) => skipBlogName(getLink(id)?.title || "");

//created
defineProps<{
  pending: boolean;
  title: string;
  data: RankerStat[];
}>();
</script>
<template>
  <q-card>
    <q-card-section>
      <q-list>
        <template v-if="pending">
          <q-item class="text-center">
            <q-item-section>
              <q-item-label class="text-weight-bold text-subtitle1">
                {{ title }}
              </q-item-label>
              <q-item-label class="q-pt-sm">
                <q-spinner color="green-4" size="6em" :thickness="3" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-else>
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
