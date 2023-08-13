import {
  DaysCount,
  LastPost,
  LastPostPlus,
  LinkWrap,
  Post,
  ScrapItem,
} from "@/types/common";
import { SearchParam, LinkIdsType } from "@/types/api";
import { getAgoString, getDateString } from "@/plugin/dayjs";

const getIds = (links?: LinkWrap[]) =>
  links ? links.map(({ link }) => link.id) : [];

export default {
  createPosts(linkId?: number, items?: ScrapItem[]) {
    if (items?.length === 0) return;
    return useAPIFetch("post", { method: "post", body: { linkId, items } });
  },
  findAllPosts(links?: LinkWrap[], page?: number) {
    return useAPIFetch("post", { params: { linkIds: getIds(links), page } });
  },
  findPosts(props: SearchParam) {
    const { teamId, tag, q, page } = props;
    return useAPIFetch<Post[]>("post", {
      params: { teamId, tag, q, page },
      lazy: true,
    });
  },
  findCountGroupById(props: LinkIdsType) {
    return useAPIFetch<{ linkId: number; count: number }[]>("post/many", {
      params: { linkIds: props.linkIds },
      lazy: true,
    });
  },
  findLast(props: LinkIdsType) {
    return useAPIFetch<LastPost[]>("post/last", {
      params: { linkIds: props.linkIds },
      lazy: true,
      transform: (lasts: LastPost[]): LastPostPlus[] =>
        lasts.map((v) => ({
          ...v,
          dateString: getDateString(v.createdAt),
          agoString: getAgoString(v.createdAt),
        })),
    });
  },
  countByDate(props: LinkIdsType = {}) {
    return useAPIFetch<DaysCount<number>[]>("post/count/date", {
      params: props ? { linkIds: props.linkIds } : {},
      lazy: true,
      transform: (
        counts: DaysCount<{ totalCount: number }>[]
      ): DaysCount<number>[] =>
        counts.map((v) => ({
          ...v,
          count: v.count ? v.count.totalCount || 0 : 0,
        })),
    });
  },
};
