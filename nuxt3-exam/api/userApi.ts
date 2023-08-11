import { User } from "@/types/common";

type TokenType = { atk: string; rtk: string };

export default {
  findUser(atk: string) {
    return useAPIFetch<User>("user", {
      headers: { Authorization: `Bearer ${atk}` },
    });
  },
  logoutUser(id: string) {
    useAPIFetch("auth/logout", { params: { id } });
  },
  async reissue() {
    return await useFetch<TokenType>("/api/reissue");
  },
  async reissueAtk() {
    return await useFetch<TokenType>("/api/reissue-atk");
  },
};
