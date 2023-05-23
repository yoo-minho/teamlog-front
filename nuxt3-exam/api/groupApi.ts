import { Tag, Group, Link, BlogType } from "../types/common";

export default {
  async findAll(props: {
    tag?: Ref<string>;
    page: Ref<number>;
    sort?: Ref<string>;
  }) {
    const config = useRuntimeConfig();
    const { tag, page, sort } = props;
    return await useFetch<Group[]>(() => `group`, {
      baseURL: config.public.apiBase,
      params: { page, sort, tag },
    });
  },
  async count() {
    const config = useRuntimeConfig();
    return await useFetch<{
      groupCount: number;
      linkCount: number;
      postCount: number;
      linkCountByPlatform: { _count: number; type: BlogType }[];
    }>("group/counts", {
      baseURL: config.public.apiBase,
    });
  },
  async findAllTag() {
    const config = useRuntimeConfig();
    try {
      return await useFetch<Tag[]>("tag", {
        baseURL: config.public.apiBase,
      });
    } catch (err) {
      throw new Error("");
    }
  },
  async findById(domain: string) {
    const config = useRuntimeConfig();
    try {
      return await useFetch<Group>(() => `group/${domain}`, {
        baseURL: config.public.apiBase,
      });
    } catch (err) {
      throw new Error("");
    }
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
