import { ref } from "vue";
import {
  DaysAllCounts,
  DaysCount,
  LastPost,
  LinkWrap,
  Post,
  ScrapItem,
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
  async findLast(links: LinkWrap[]) {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;
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

      // const convData = ref();
      // const { data, ...rest } = await useFetch<DaysAllCounts[]>(
      //   "post/count/date",
      //   {
      //     baseURL,
      //     params: {
      //       linkIds: computed(() =>
      //         props.links.value?.map(({ link }) => link.id)
      //       ),
      //     },
      //   }
      // );
      // convData.value = (data.value || []).map((v) => ({
      //   ...v,
      //   count: v.count ? v.count.totalCount || 0 : 0,
      // }));
      // return { data: convData, ...rest };
    } catch (err) {
      throw new Error("");
    }
  },
};
