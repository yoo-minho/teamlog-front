import { defineStore } from "pinia";
import { QScrollArea } from "quasar";
import { Tag, User } from "@/types/common";

export const useUserStore = defineStore("user", {
  state: () => ({
    atk: "",
    settingTitle: "",
    user: {} as User,
    isSearchMode: false,
    searchWord: "",
    mainScrollAreaRef: null as unknown as QScrollArea,
    tags: [] as Tag[],
  }),
  getters: {
    isExistsUser: (state) => !!state.user?.id,
  },
  actions: {
    isMyContents(createrId?: string) {
      return (
        createrId === this.user.id ||
        ["KAKAO_2710302227"].includes(this.user.id)
      );
    },
    initSearchData() {
      this.isSearchMode = false;
      this.searchWord = "";
    },
    setSearchData(value: string) {
      this.isSearchMode = "" !== value;
      this.searchWord = value;
    },
    toggleSearchMode() {
      this.isSearchMode = !this.isSearchMode;
      if (!this.isSearchMode) {
        this.searchWord = "";
      }
    },
  },
});
