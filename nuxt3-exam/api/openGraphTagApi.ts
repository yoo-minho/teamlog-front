import { OGSResultType } from "@/types/api";

export default {
  index(url: string) {
    return useAPIFetch<OGSResultType>("open-graph-tag", { params: { url } });
  },
};
