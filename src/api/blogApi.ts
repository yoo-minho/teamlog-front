import { Link } from "@/types/common";
import { BlogFilter } from "@/types/api";

export default {
  findAll(props: BlogFilter) {
    const { tag, page } = props;
    return useAPIFetch<Link[]>("link", { params: { tag, page }, lazy: true });
  },
};
