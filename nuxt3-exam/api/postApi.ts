import { ref } from "vue";
import { LastPost, LinkWrap, ScrapItem } from "@/types/common";
import { getAgoString, getDateString } from "@/plugin/dayjs";

type SearchParam = {
  links?: LinkWrap[];
  tag?: string;
  q?: string;
  page?: number;
};

const getIds = (links?: LinkWrap[]) =>
  links ? links.map(({ link }) => link.id) : [];

const config = useRuntimeConfig();
const baseURL = config.public.apiBase;

export default {
  async createPosts(linkId?: number, items?: ScrapItem[]) {
    if (items?.length === 0) return;

    try {
      await useFetch("post", {
        baseURL,
        body: { linkId, items },
      });
    } catch (e) {}
  },
  async findAllPosts(links?: LinkWrap[], page?: number) {
    try {
      return await useFetch("post", {
        baseURL,
        params: { linkIds: getIds(links), page },
      });
    } catch (err) {}
  },
  async searchPosts(props: SearchParam) {
    const { links, tag, q, page } = props;
    try {
      return await useFetch("post/search", {
        baseURL,
        params: { linkIds: getIds(links), tag, q, page },
      });
    } catch (err) {}
  },
  async findLast(links: LinkWrap[]) {
    try {
      const { data } = await useFetch("post/last", {
        baseURL,
        params: { linkIds: getIds(links) },
      });
      const _data = (data.value as []).map((post: LastPost) => ({
        ...post,
        dateString: getDateString(post.createdAt),
        agoString: getAgoString(post.createdAt),
      }));
      return {
        data: ref(_data),
      };
    } catch (err) {}
  },
  async findCountGroupById(links: LinkWrap[]) {
    try {
      const { data } = await useFetch("post/many", {
        params: { linkIds: getIds(links) },
      });
      return {
        data: ref(data),
      };
    } catch (err) {}
  },
  async countByDate(links: LinkWrap[]) {
    try {
      return await useFetch("post/count/date", {
        params: { linkIds: getIds(links) },
      });
    } catch (err) {}
  },
};
