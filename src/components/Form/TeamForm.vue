<script setup lang="ts">
import LinkCard from "@/components/Card/LinkCard.vue";
import LinkDialog from "@/components/Dialog/LinkDialog.vue";
import { Link, TeamFormType, Team } from "@/types/common";
import { scrapOGS } from "@/composables/useOgs";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

type TempTag = { id: number | string; name: string };

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const isMobile = $q.platform.is.mobile;
const isDarkActive = ref($q.dark.isActive);
const userStore = useUserStore();
const { tags } = storeToRefs(userStore);

watch(
  () => $q.dark.isActive,
  (val) => (isDarkActive.value = val)
);

const props = defineProps<{ currentTeam?: Team }>();
const emits = defineEmits<{
  (eventName: "submit", value: TeamFormType): void;
}>();
const { currentTeam } = toRefs(props);
const {
  id = -1,
  title = "",
  domain = "",
  description = "",
  tags: currentSelectedTag = [],
} = currentTeam?.value || {};
const showLink = ref(false);
const domainRef = ref();
const _domain = ref(domain);
const _title = ref(title);
const _description = ref(description);

const tag2tag = ({ name, id }: TempTag) => ({ label: name, value: id });
const options = tags.value?.map(tag2tag) || [];
const selectTags = currentSelectedTag?.map(({ tag }) => tag2tag(tag)) || [];
const _selectedTags = ref(selectTags);
const links = ref(currentTeam?.value?.links?.map((l) => l.link) || []);
const linksCountLabel = computed(() =>
  links.value.length > 0 ? `(${links.value.length}/10)` : ""
);
const titleRules = [
  (val: string) => val?.length > 2 || "팀 이름을 3자 이상 입력해주세요!",
];
const idRules = [
  (val: string) => val?.length > 2 || "도메인을 3자 이상 입력해주세요!",
  (val: string) =>
    new RegExp(/^[A-Za-z0-9_+]*$/).test(val) ||
    "대소문자, 숫자, 언더바를 활용하여 입력해주세요!",
];

const saveLink = (link: Link) => links.value.push(link);
const deleteLink = (url: string) => {
  links.value = links.value.filter((link) => link.url !== url);
};
const refreshLink = async (url: string, stopLoading: () => void) => {
  const { error, title, description, imagePath } = await scrapOGS(url);
  stopLoading();
  if (error) return;
  links.value = links.value.map((link) =>
    link.url === url ? { ...link, title, description, imagePath } : link
  );
};
const submitForm = () => {
  if ((_domain.value || "").length === 0) {
    Notify.create({ type: "negative", message: "도메인을 입력해주세요!" });
    domainRef.value?.focus();
    return;
  }
  if (!links.value || links.value.length < 2) {
    Notify.create({
      type: "negative",
      message: "최소 2개의 url이 필요합니다.",
    });
    return;
  }
  const submitData = {
    id,
    domain: _domain.value,
    title: _title.value,
    description: _description.value,
    tags: _selectedTags.value.map((tag) => tag.label || tag) as string[],
    links: links.value,
  };
  emits("submit", submitData);
};
</script>
<template>
  <q-layout
    class="max-width"
    :class="`${isDarkActive ? 'bg-grey-9' : 'bg-white'}`"
  >
    <q-header bordered class="max-width bg-primary text-white">
      <q-toolbar>
        <q-btn
          area-label="close"
          flat
          round
          dense
          icon="close"
          @click="router.back()"
        />
        <q-toolbar-title>{{ route.meta.title }}</q-toolbar-title>
        <q-btn
          area-label="submitForm"
          flat
          round
          icon="done"
          @click="() => submitForm()"
        />
      </q-toolbar>
    </q-header>
    <q-page-container class="max-width">
      <q-scroll-area :visible="false" class="max-width without-header">
        <q-page class="q-pa-md max-width" :class="{ 'width-100vw': isMobile }">
          <q-form class="q-gutter-y-md column">
            <q-input
              v-model="_title"
              placeholder="팀 이름 추가"
              label="팀 이름"
              counter
              maxlength="20"
              stack-label
              autofocus
              hide-bottom-space
              :rules="titleRules"
            />
            <q-input
              ref="idRef"
              v-model="_domain"
              label="전용 링크"
              type="email"
              stack-label
              counter
              maxlength="20"
              placeholder="전용 링크 추가"
              prefix="https://teamlog.cc/@"
              :rules="idRules"
            />
            <q-input
              v-model="_description"
              stack-label
              autogrow
              clearable
              counter
              maxlength="100"
              type="textarea"
              label="팀 설명"
              placeholder="(선택) 팀 설명을 적어주세요!"
              hide-bottom-space
            />
            <q-select
              v-model="_selectedTags"
              stack-label
              label="태그 추가"
              use-input
              use-chips
              multiple
              input-debounce="0"
              :options="options"
              new-value-mode="add-unique"
            />
            <q-btn
              color="primary"
              class="full-width"
              area-label="addLink"
              @click="showLink = true"
            >
              <span class="q-ml-sm">{{ linksCountLabel }}</span>
            </q-btn>
            <q-list
              v-if="links.length > 0"
              bordered
              separator
              class="full-width"
            >
              <div v-for="(link, i) in links" :key="i" :data-key="link.id">
                <LinkCard
                  :link="link"
                  icon-name="clear"
                  @click-icon="() => deleteLink(link.url)"
                  @refresh-icon="
                    (stopLoading) => refreshLink(link.url, stopLoading)
                  "
                />
              </div>
            </q-list>
            <LinkDialog
              :show="showLink"
              @hide="showLink = false"
              @save-link="saveLink"
            />
          </q-form>
        </q-page>
      </q-scroll-area>
    </q-page-container>
  </q-layout>
</template>
