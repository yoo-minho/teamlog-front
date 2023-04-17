import { MainTabType } from "@/types/common";
import { defineStore } from "pinia";
import { QScrollArea } from "quasar";

import UserApi from "../api/userApi";

export const useUserStore = defineStore("user", {
  state: () => ({
    userLoading: false,
    id: "",
    email: "",
    name: "",
    profileImage: "",
    mainTab: "" as MainTabType,
    isSearchMode: false,
    searchWord: "",
    mainScrollAreaRef: null as unknown as QScrollArea,
  }),
  getters: {
    isExistsUser: (state) => !!state.id,
  },
  actions: {
    initSearchData() {
      this.isSearchMode = false;
      this.searchWord = "";
    },
    async fetchUser() {
      this.userLoading = true;
      // const { data: user } = await UserApi.findUser();
      const user = ref([]);
      this.userLoading = false;
      // this.id = user.value.id;
      // this.email = user.value.email;
      // this.name = user.value.name;
      // this.profileImage = user.value.profileImage;
      return;
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
      this.mainTab = nextTab as MainTabType;
    },
  },
});
