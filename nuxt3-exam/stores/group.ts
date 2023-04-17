import { defineStore, storeToRefs } from "pinia";
import { Group, Link, TabType } from "../types/common";
import GroupApi from "../api/groupApi";
import { getDateString, isSameDate } from "@/plugin/dayjs";
import { scrapOGS } from "@/hooks/useOgs";
import { useTagStore } from "@/stores/tag";
import { LocalStorage } from "quasar";

export const useGroupStore = defineStore("group", {
  state: () => ({
    linksOnEditor: [] as Link[],
    groupsLoading: true,
    groups: [] as Group[],
    groupLoading: true,
    currentGroup: {} as Group,
    selectTab: "" as TabType,
    groupSort: LocalStorage.getItem("groupSort") || "lastPostCreatedAt",
  }),
  getters: {
    linkCountMessage: ({ linksOnEditor: links }) =>
      links.length > 0 ? `(${links.length}/10)` : "",
    minScrapAt: ({ currentGroup }) => {
      if (!currentGroup.links) return;
      return (
        getDateString(
          currentGroup.links
            .map(({ link }) => ({
              time: link.scrapAt?.getTime() || 0,
              scrapAt: link.scrapAt,
            }))
            .sort((x, y) => x.time - y.time)
            .splice(0, 1)[0].scrapAt
        ) || "fail to scrap ..."
      );
    },
  },
  actions: {
    handleSwipeTab(direction: "left" | "right", currentTab: TabType) {
      // if (!this.isOrginalHeader) return; //스크롤 내렸을땐 좌우가 안 움직이도록!
      const tabs = [`GroupDetailLink`, `GroupDetailPost`, `GroupDetailStat`];
      const idx = tabs.indexOf(currentTab);
      let nextTab;
      if (direction === "left") {
        nextTab = tabs[(idx + 1) % 3];
      } else if (direction === "right") {
        nextTab = tabs[(idx + 2) % 3];
      }
      this.selectTab = nextTab as TabType;
    },
    initLinks(data?: Link[]) {
      if (!data) {
        this.linksOnEditor.length = 0;
      } else {
        this.linksOnEditor = data;
      }
    },
    addLink(v: Link) {
      this.linksOnEditor.push(v);
    },
    deleteLink(type: "ADD" | "EDIT", id: number) {
      const filterFn = (v: Link, idx: number) =>
        type === "EDIT" ? v.id !== id : idx !== id;
      this.linksOnEditor = this.linksOnEditor.filter(filterFn);
    },
    async refreshLink(id?: number, url?: string) {
      if (!id || !url) return;
      const ogsData = await scrapOGS(url);
      if (ogsData.error) return;
      this.linksOnEditor = [...this.linksOnEditor].map((link) => {
        if (link.id === id) {
          link = {
            ...link,
            title: ogsData.title,
            description: ogsData.description,
            imagePath: ogsData.imagePath,
          };
        }
        return link;
      });
    },
    initGroupData() {
      this.groupLoading = true;
      this.currentGroup = {} as Group;
    },
    sortGroups(sortValue: string) {
      this.groupSort = sortValue;
      this.fetchGroups();
    },
    async fetchGroups(page?: number) {
      const tagStore = useTagStore();
      const { currentTag, isTotalTag } = storeToRefs(tagStore);
      const isFirstPage = !page || page === 1;
      // const { data } = await GroupApi.findAll({
      //   page: page || 1,
      //   sort: this.groupSort,
      //   ...(isTotalTag.value ? {} : { tag: currentTag.value }),
      // });
      const data = ref([]);
      this.groups = isFirstPage ? data.value : [...this.groups, ...data.value];
      this.groupsLoading = false;
      return data.value.length > 0;
    },
    async fetchGroup(domain: string) {
      if (this.currentGroup.domain === domain) {
        this.groupLoading = false;
        return;
      }
      const { data } = await GroupApi.findById(domain);
      this.groupLoading = false;
      this.currentGroup = data.value;
      this.groups = this.groups.map((v) =>
        v.id === data.value.id ? data.value : v
      );
    },
    async refreshGroup(domain: string) {
      this.groupLoading = true;
      const { data } = await GroupApi.findById(domain);
      this.groupLoading = false;
      this.currentGroup = data.value;
      this.groups = [
        ...this.groups.map((group) =>
          group.domain === domain ? data.value : group
        ),
      ];
    },
    updateCurrentGroupLinksScrapAt() {
      this.currentGroup.links = this.currentGroup.links?.map(({ link }) => {
        link.scrapAt = new Date();
        return { link };
      });
    },
    updateCurrentGroupLastPostCreatedAt({
      lastPostCreatedAt,
    }: {
      lastPostCreatedAt: Date;
    }) {
      if (isSameDate(this.currentGroup.lastPostCreatedAt, lastPostCreatedAt))
        return;
      this.currentGroup.lastPostCreatedAt = lastPostCreatedAt;
      const domain = this.currentGroup.domain;
      this.groups = [...this.groups].map((group) =>
        group.domain === domain ? { ...group, lastPostCreatedAt } : group
      );
    },
    async save(
      title: string,
      domain: string,
      description: string,
      tags: string[]
    ) {
      await GroupApi.create(
        {
          domain,
          title,
          description,
        },
        tags,
        this.linksOnEditor
      );
    },
    async fix(
      id: number,
      title: string,
      domain: string,
      description: string,
      tags: string[]
    ) {
      await GroupApi.update(
        id,
        {
          domain,
          title,
          description,
        },
        tags,
        this.linksOnEditor
      );
    },
  },
});
