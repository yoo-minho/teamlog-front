import { defineStore, storeToRefs } from "pinia";
import { Tag } from "../types/common";
import GroupApi from "../api/groupApi";
import { POST_TAG, BLOG_TAG } from "@/constants";
import { useGroupStore } from "./group";

const totalTag = "All";

export const useTagStore = defineStore("tag", {
  state: () => ({
    tagsLoading: true,
    tags: [] as Tag[],
    currentTag: totalTag,
    teamTags: [] as Tag[],
  }),
  getters: {
    isTotalTag: (state) => state.currentTag === totalTag,
    TagNames: ({ tags }) => tags.map(({ name }) => name.toLowerCase()),
  },
  actions: {
    initTag() {
      this.currentTag = totalTag;
    },
    async fetchTag(name: string) {
      const plusAll = (tags: Tag[]) => [
        { id: totalTag, name: totalTag },
        ...(tags as []),
      ];
      switch (name) {
        case "team":
          this.tags = this.teamTags;
          if (this.tags.length === 0) {
            const res = await GroupApi.findAllTag();
            console.log(res);
            const { data } = res;
            console.log("asdsad", data.value);
            if (!data.value) return;
            this.tags = plusAll(data.value);
            this.teamTags = this.tags;
          }
          break;
        case "blog":
          this.tags = plusAll(
            BLOG_TAG.map((v) => ({ id: v.type, name: v.type }))
          );
          break;
        case "post":
          this.tags = plusAll(
            POST_TAG.map((v) => ({ id: v.label, name: v.label }))
          );
          break;
        case "InTeam":
          const groupStore = useGroupStore();
          const { currentGroup } = storeToRefs(groupStore);
          this.tags = currentGroup.value.tags?.map(({ tag }) => ({
            id: String(tag.id),
            name: tag.name,
          })) as Tag[];
          break;
        default:
          break;
      }
      this.tagsLoading = false;
    },
    setCurrentTag(tag?: string) {
      this.currentTag = tag || totalTag;
    },
  },
});
