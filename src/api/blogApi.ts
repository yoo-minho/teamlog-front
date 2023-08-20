import { Link } from "@/types/common";
import { BlogFilter } from "@/types/api";

export default {
  findAll(props: BlogFilter) {
    const { tag, page, withTeam } = props;
    return useAPIFetch<Link[]>("link", {
      params: { tag, page, withTeam },
      lazy: true,
    });
  },
  async create(props: Link) {
    const { url, rssUrl, title, description, type, imagePath } = props;
    return await useAPIFetch("link", {
      method: "post",
      body: { url, rssUrl, title, description, type, imagePath },
    });
  },
};
