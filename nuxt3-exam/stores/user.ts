import { MainTabType } from "@/types/common";
import { defineStore } from "pinia";
import { QScrollArea } from "quasar";

import { User } from "~/types/common";

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
  },
  actions: {
    initSearchData() {
      this.isSearchMode = false;
      this.searchWord = "";
    },
    toggleSearchMode() {
      this.isSearchMode = !this.isSearchMode;
      if (!this.isSearchMode) {
        this.searchWord = "";
      }
    },
    handleSwipeMainTab(direction: "left" | "right", currentTab: MainTabType) {
      const tabs = [`t_0`, `t_1`, `t_2`, "t_3", "t_4"];
      const idx = tabs.indexOf(currentTab);
      let nextTab;
      if (direction === "left") {
        nextTab = tabs[(idx + 1) % tabs.length];
      } else if (direction === "right") {
        nextTab = tabs[(idx + tabs.length - 1) % tabs.length];
      }
    },
  },
});
