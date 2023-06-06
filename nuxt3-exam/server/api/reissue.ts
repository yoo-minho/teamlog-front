export default defineEventHandler(async (event) => {
  const currentRtk = getCookie(event, "refresh-token");
  const config = useRuntimeConfig();
  const { statusCode, atk, rtk } = await $fetch<{
    statusCode: number;
    atk: string;
    rtk: string;
  }>("auth/refresh", {
    baseURL: config.public.apiBase,
    headers: { Authorization: `Bearer ${currentRtk}` },
  });
  if (statusCode === 401 || rtk === "") return { atk: "", rtk: "" };
  return { atk, rtk };
});
