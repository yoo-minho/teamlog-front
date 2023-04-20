import { Group, Link } from "../types/common";

export default {
  async findAll(props: { tag?: string; page?: number; sort?: string } = {}) {
    const config = useRuntimeConfig();
    const { tag, page, sort } = props;
    try {
      const { data } = await useFetch("group", {
        baseURL: config.public.apiBase,
        params: { tag, page, sort },
      });
      return data.value;
    } catch (err) {}
  },
  async count() {
    try {
      return await useFetch("group/counts");
    } catch (err) {}
  },
  async findAllTag() {
    const config = useRuntimeConfig();
    try {
      return await useFetch("tag", {
        baseURL: config.public.apiBase,
      });
    } catch (err) {}
  },
  async findById(domain: string) {
    try {
      return await useFetch(`group/${domain}`);
    } catch (err) {}
  },
  async create(group: Group, tags: string[], links: Link[]) {
    const { domain, title, description } = group;
    try {
      await useFetch("group", {
        method: "post",
        body: {
          domain,
          title,
          description,
          links,
          tags,
        },
      });
    } catch (axiosError) {}
  },
  async update(id: number, group: Group, tags: string[], links: Link[]) {
    const { domain, title, description } = group;
    try {
      await useFetch("group", {
        method: "put",
        body: {
          id,
          domain,
          title,
          description,
          links,
          tags,
        },
      });
    } catch (axiosError) {}
  },
  async updateLastPostCreateAt(groupId?: number) {
    if (!groupId) throw new Error("No Group Id");
    try {
      const { data } = await useFetch("group/last-post-create-at", {
        method: "patch",
        body: {
          groupId,
        },
      });
      //   return { lastPostCreatedAt: new Date(data.lastPostCreatedAt) };
      return { lastPostCreatedAt: new Date() };
    } catch (axiosError) {}
  },
};
