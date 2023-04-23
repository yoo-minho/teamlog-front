import { Tag, Group, Link } from "../types/common";

export default {
  async findAll(props: {
    tag?: Ref<string>;
    page: Ref<number>;
    sort?: Ref<string>;
  }) {
    const config = useRuntimeConfig();
    const { tag, page, sort } = props;
    try {
      return await useFetch<Group[]>(() => `group`, {
        baseURL: config.public.apiBase,
        params: { page, sort, tag },
      });
    } catch (err) {
      throw new Error("");
    }
  },
  async count() {
    try {
      return await useFetch("group/counts");
    } catch (err) {}
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
