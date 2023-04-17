import { defineStore, storeToRefs } from 'pinia';
import { Link } from '../types/common';
import blogApi from '@/api/blogApi';
import { useTagStore } from './tag';

export const useBlogStore = defineStore('blog', {
  state: () => ({
    blogs: [] as Link[],
    blogsLoading: true,
    currentBlog: {} as Link,
  }),
  getters: {},
  actions: {
    async fetchBlogs(page?: number) {
      const isFirstPage = !page || page === 1;
      const tagStore = useTagStore();
      const { currentTag, isTotalTag } = storeToRefs(tagStore);
      const { data } = await blogApi.findAll(isTotalTag.value ? { page } : { tag: currentTag.value, page });
      this.blogs = isFirstPage ? data.value : [...this.blogs, ...data.value];
      this.blogsLoading = false;
      return data.value.length > 0;
    },
  },
});
