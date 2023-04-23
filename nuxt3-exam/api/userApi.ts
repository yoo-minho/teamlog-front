export default {
  async findUser() {
    try {
      return await useFetch("user");
    } catch (err) {
      throw new Error("");
    }
  },
  async loginKakao() {
    try {
      return await useFetch("auth/kakao");
    } catch (err) {
      throw new Error("");
    }
  },
  async logoutUser() {
    try {
      return await useFetch("auth/logout");
    } catch (err) {
      throw new Error("");
    }
  },
};
