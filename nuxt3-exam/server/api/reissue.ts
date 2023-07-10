export default defineEventHandler(async (event) => {
  const currentRtk = getCookie(event, "refresh-token");
  if (currentRtk === "") return { atk: "", rtk: "" };
  const userAgent = getRequestHeader(event, "user-agent") || "";
  const config = useRuntimeConfig();
  const { statusCode, atk, rtk } = await $fetch<{
    statusCode: number;
    atk: string;
    rtk: string;
  }>("auth/refresh", {
    baseURL: config.public.apiBase,
    headers: { Authorization: `Bearer ${currentRtk}`, "user-agent": userAgent },
  });
  if (statusCode === 401 || rtk === "") return { atk: "", rtk: "" };
  return { atk, rtk };
});
