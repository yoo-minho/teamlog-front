import { Link } from "~/types/common";

export default {
  async findAll(props: { tag?: Ref<string>; page?: Ref<number> } = {}) {
    const config = useRuntimeConfig();
    const { tag, page } = props;
    try {
      return await useFetch<Link[]>("link", {
        baseURL: config.public.apiBase,
        params: { tag, page },
      });
    } catch (err) {
      throw new Error("");
    }
  },
};
