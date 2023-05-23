import { User } from "~/types/common";
import { parse } from "set-cookie-parser";

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
    const config = useRuntimeConfig();
    const rtk = useCookie("refresh-token", {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });
    const baseURL = config.public.apiBase;
    return await useFetch<{ atk: string }>("auth/refresh", {
      baseURL,
      headers: { Authorization: `Bearer ${rtk.value}` },
      onResponse({ response }) {
        if (!process.server) return;

        const { statusCode } = response._data;
        if (statusCode === 401) {
          rtk.value = "";
          return;
        }

        const combinedCookie = response.headers.get("set-cookie");
        if (!combinedCookie) {
          rtk.value = "";
          return;
        }
        const cookies = parse(combinedCookie);
        const cookie = cookies.find((c) => c.name === "refresh-token");
        if (!cookie) {
          rtk.value = "";
          return;
        }
        rtk.value = cookie.value || "";
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
