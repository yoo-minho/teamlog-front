import { useFetch } from "#app";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/user";
import UserApi from "../api/userApi";

const isProd = process.env.NODE_ENV === "production";

export const useAPIFetch = <ResT>(path: string, opts = {}) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase[isProd ? "prod" : "dev"];
  return useFetch<ResT>(path, { baseURL, ...opts });
};

export const useAPIFetchWithGuard = <T>(path: string, opts = {}) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase[isProd ? "prod" : "dev"];
  const { atk } = storeToRefs(useUserStore());
  if (!atk.value) throw new Error("잠시후 다시 시도해주세요!");
  const headers = ref({ Authorization: `Bearer ${atk.value}` });
  return useFetch<T>(path, {
    baseURL,
    ...opts,
    retry: 3,
    headers,
    watch: [atk],
    onResponseError: async ({ response }) => {
      const res = response._data?.res;
      if (res.name === "TokenExpiredError") {
        const { data } = await UserApi.reissueAtk();
        if (data.value?.atk) {
          atk.value = data.value.atk;
          headers.value = { Authorization: `Bearer ${atk.value}` };
        }
        return;
      }
    },
  });
};
