import { defineStore } from "pinia";
import { Team } from "@/types/common";

export const useTeamStore = defineStore("team", {
  state: () => ({
    teams: [] as Team[],
    currentTeam: {} as Team,
  }),
  getters: {
    currentTeamLinkIds: (state) =>
      state.currentTeam.links?.map(({ link: l }) => l.id) || [],
  },
  actions: {},
});
