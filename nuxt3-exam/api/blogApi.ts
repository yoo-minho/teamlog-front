export default {
  async findAll(props: { tag?: string; page?: number } = {}) {
    const config = useRuntimeConfig();
    const { tag, page } = props;
    try {
      return await useFetch("link", {
        baseURL: config.public.apiBase,
        params: { tag, page },
      });
    } catch (err) {}
  },
};
