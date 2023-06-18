import { User } from "~/types/common";
import { useUserStore } from "~/stores/user";
import { storeToRefs } from "pinia";

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
  async reissueTest() {
    const userStore = useUserStore();
    const { atk } = storeToRefs(userStore);
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;

    //computed로 하면 호출할때마다 이벤트 누적되는 이슈 있음
    const headers = ref({ Authorization: `Bearer ${atk.value}` });
    return await useFetch("auth/refresh/test", {
      baseURL,
      headers,
      onResponseError: async (context) => {
        if (context.response._data.res?.name === "TokenExpiredError") {
          const { data } = await this.reissueAtk();
          if (data.value?.atk) {
            atk.value = data.value?.atk;
            headers.value = { Authorization: `Bearer ${atk.value}` };
          }
        }
      },
    });
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
