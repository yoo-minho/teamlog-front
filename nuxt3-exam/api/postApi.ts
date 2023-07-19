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
  teamId?: Ref<string>;
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
    await $fetch("post", {
      baseURL,
      method: "post",
      body: { linkId, items },
    });
  },
  async findAllPosts(links?: LinkWrap[], page?: number) {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;
    return await useFetch("post", {
      baseURL,
      params: { linkIds: getIds(links), page },
    });
  },
  async findPosts(props: SearchParam) {
    const { teamId, tag, q, page } = props;
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;
    return await useFetch<Post[]>("post", {
      baseURL,
      params: { teamId, tag, q, page },
      lazy: true,
    });
  },
  async findCountGroupById(props: { linkIds: Ref<(number | undefined)[]> }) {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;
    return await useFetch<linkCount[]>("post/many", {
      baseURL,
      params: { linkIds: props.linkIds },
      lazy: true,
    });
  },
  async findLast(props: { linkIds: Ref<(number | undefined)[]> }) {
    console.log("findLastfindLast");
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;
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
      lazy: true,
      transform: (lasts) =>
        lasts.map((v) => ({
          ...v,
          dateString: getDateString(v.createdAt),
          agoString: getAgoString(v.createdAt),
        })),
    });
  },
  async countByDate(props: { linkIds: Ref<(number | undefined)[]> }) {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;
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
      lazy: true,
      transform: (counts) =>
        counts.map((v) => ({
          ...v,
          count: v.count ? v.count.totalCount || 0 : 0,
        })),
    });
  },
};
