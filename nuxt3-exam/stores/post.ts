import { defineStore, storeToRefs } from "pinia";
import { DaysCount, LastPost, linkCount, Post } from "../types/common";
import { useGroupStore } from "./group";
import { useUserStore } from "./user";
import { skipBlogName } from "@/util/NameUtil";
import { changeMarkContents } from "~/hooks/useHighlight";

const MMM = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const day = [0, 1, 2, 3, 4, 5, 6];

export const usePostStore = defineStore("post", {
  state: () => ({
    posts: [] as Post[],
    postLoading: false,
    jandis: [] as DaysCount[],
    jandiLoading: false,
    lastPosts: [] as LastPost[],
    lastLoading: false,
    countPostGroupByLinkId: [] as linkCount[],
    lots: [] as linkCount[],
    scrapLoading: false,
    tagWord: "",
  }),
  getters: {
    titleOfPostCounting(): string[] {
      const groupStore = useGroupStore();
      const { currentGroup } = storeToRefs(groupStore);
      return this.countPostGroupByLinkId
        .map(
          ({ linkId }) =>
            currentGroup.value.links?.find(({ link }) => link.id === linkId)
              ?.link.title || ""
        )
        .map((v) => skipBlogName(v));
    },
    countOfPostCounting(): number[] {
      return this.countPostGroupByLinkId.map(({ count }) => count);
    },
    activeJandis: ({ jandis }) => jandis.filter(({ count }) => count > 0) || [],
    activeJandisCount() {
      const _active = this.activeJandis as DaysCount[];
      return _active.reduce(
        (total: number, val: DaysCount) => total + val.count,
        0
      );
    },
    nextPostingDay() {
      return ((c: number) =>
        c > 0 ? `${Math.round((90 / c) * 100) / 100}일` : "-")(
        +this.activeJandisCount
      );
    },
    manyPostingMMM() {
      const _active = this.activeJandis as DaysCount[];
      if (_active.length === 0) return "-";
      const dayOfWeek = day
        .map((d) => ({
          day: d,
          count: _active.filter(({ day }) => day === d).length,
        }))
        .sort((x, y) => y.count - x.count);
      return MMM[dayOfWeek[0].day];
    },
  },
  actions: {
    savePosts(init: boolean, newPosts: Post[] | null) {
      const userStore = useUserStore();
      const { searchWord } = storeToRefs(userStore);
      if (init) {
        this.posts = newPosts || [];
      } else {
        this.posts = [...this.posts, ...(newPosts || [])];
      }
      this.posts = this.posts.map((post) => ({
        ...post,
        title: changeMarkContents(post.title, searchWord.value),
      }));
    },
  },
});
