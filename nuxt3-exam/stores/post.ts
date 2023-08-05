import { defineStore, storeToRefs } from "pinia";
import { DaysCount, Post } from "@/types/common";
import { useUserStore } from "./user";
import { changeMarkContents } from "@/composables/useHighlight";

export const usePostStore = defineStore("post", {
  state: () => ({
    posts: [] as Post[],
    jandis: [] as DaysCount[],
  }),
  getters: {},
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
