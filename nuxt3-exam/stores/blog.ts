import { defineStore } from "pinia";
import { Link } from "../types/common";

export const useBlogStore = defineStore("blog", {
  state: () => ({
    blogs: [] as Link[],
    blogsLoading: true,
    currentBlog: {} as Link,
  }),
  getters: {},
  actions: {
    async saveBlogs(init: boolean, newBlogs: Link[] | null) {
      if (init) {
        this.blogs = newBlogs || [];
      } else {
        this.blogs = [...this.blogs, ...(newBlogs || [])];
      }
    },
  },
});
