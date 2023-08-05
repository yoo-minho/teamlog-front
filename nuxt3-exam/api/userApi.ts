import { User } from "@/types/common";

export default {
  async findUser(atk: Ref<string>) {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;
    return await useFetch<User>("user", {
      baseURL,
      headers: { Authorization: `Bearer ${atk.value}` },
    });
  },
  async reissue() {
    return await useFetch<{ atk: string; rtk: string }>("/api/reissue");
  },
  async reissueAtk() {
    return await useFetch<{ atk: string; rtk: string }>("/api/reissue-atk");
  },
  async loginKakao() {
    try {
      return await useFetch("auth/kakao");
    } catch (err) {
      throw new Error("");
    }
  },
  async logoutUser(id: string) {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;
    await useFetch("auth/logout", {
      baseURL,
      params: { id },
    });
  },
};
