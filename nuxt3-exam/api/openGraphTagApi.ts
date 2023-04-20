export default {
  async index(url: string) {
    const res = await useFetch("open-graph-tag", { params: { url } });
    return res.data;
  },
};
