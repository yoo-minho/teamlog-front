export default {
  async index(url: string) {
    const config = useRuntimeConfig();
    return await useFetch<{
      ogTitle: string;
      ogDescription: string;
      ogUrl: string;
      ogImage: { url: string };
      success: boolean;
      message?: string;
    }>("open-graph-tag", {
      baseURL: config.public.apiBase,
      params: { url },
    });
  },
};
