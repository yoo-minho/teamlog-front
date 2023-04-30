import { ref } from "vue";
import {
  DaysAllCounts,
  DaysCount,
  LastPost,
  LastPostPlus,
  LinkWrap,
  Post,
  ScrapItem,
  linkCount,
} from "@/types/common";
import { getAgoString, getDateString } from "@/plugin/dayjs";

type SearchParam = {
  links?: LinkWrap[];
  tag?: Ref<string>;
  q?: Ref<string>;
  page?: Ref<number>;
};

const getIds = (links?: LinkWrap[]) =>
  links ? links.map(({ link }) => link.id) : [];

export default {
  async createPosts(linkId?: number, items?: ScrapItem[]) {
    if (items?.length === 0) return;
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;

    try {
      await useFetch("post", {
        baseURL,
        body: { linkId, items },
      });
    } catch (e) {}
  },
  async findAllPosts(links?: LinkWrap[], page?: number) {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;
    try {
      return await useFetch("post", {
        baseURL,
        params: { linkIds: getIds(links), page },
      });
    } catch (err) {}
  },
  async searchPosts(props: SearchParam) {
    const { links, tag, q, page } = props;
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;
    try {
      return await useFetch<Post[]>("post/search", {
        baseURL,
        params: { linkIds: getIds(links), tag, q, page },
      });
    } catch (err) {
      throw new Error("");
    }
  },
  async findCountGroupById(props: { linkIds: Ref<(number | undefined)[]> }) {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;
    try {
      return await useFetch<linkCount[]>("post/many", {
        baseURL,
        params: { linkIds: props.linkIds },
      });
    } catch (err) {
      throw new Error("");
    }
  },
  async findLast(props: { linkIds: Ref<(number | undefined)[]> }) {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;
    try {
      return await useFetch<
        LastPost[], //ResT
        null, //ErrorT
        "post/last", //ReqT
        "get", //Method
        LastPost[], //_ResT
        LastPostPlus[] //DataT
      >("post/last", {
        baseURL,
        params: { linkIds: props.linkIds },
        transform: (lasts) =>
          lasts.map((v) => ({
            ...v,
            dateString: getDateString(v.createdAt),
            agoString: getAgoString(v.createdAt),
          })),
      });
    } catch (err) {
      throw new Error("");
    }
  },
  async countByDate(props: { linkIds: Ref<(number | undefined)[]> }) {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;
    try {
      return await useFetch<
        DaysAllCounts[], //ResT
        null, //ErrorT
        "post/count/date", //ReqT
        "get", //Method
        DaysAllCounts[], //_ResT
        DaysCount[] //DataT
      >("post/count/date", {
        baseURL,
        params: {
          linkIds: props.linkIds,
        },
        transform: (counts) =>
          counts.map((v) => ({
            ...v,
            count: v.count ? v.count.totalCount || 0 : 0,
          })),
      });
    } catch (err) {
      throw new Error("");
    }
  },
};
