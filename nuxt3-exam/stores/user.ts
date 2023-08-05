import { defineStore } from "pinia";
import { QScrollArea } from "quasar";

import { User } from "@/types/common";

export const useUserStore = defineStore("user", {
  state: () => ({
    atk: "",
    settingTitle: "",
    user: {} as User,
    isSearchMode: false,
    searchWord: "",
    mainScrollAreaRef: null as unknown as QScrollArea,
  }),
  getters: {
    isExistsUser: (state) => !!state.user?.id,
    isMasterUser: (state) => ["KAKAO_2710302227"].includes(state.user?.id),
  },
  actions: {
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
