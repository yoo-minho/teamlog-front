export default defineEventHandler(async (event) => {
  const currentRtk = getCookie(event, "refresh-token");
  const userAgent = getRequestHeader(event, "user-agent") || "";
  const config = useRuntimeConfig();
  const { statusCode, atk } = await $fetch<{
    statusCode: number;
    atk: string;
    rtk: string;
  }>("auth/refresh/atk", {
    baseURL: config.public.apiBase,
    headers: { Authorization: `Bearer ${currentRtk}`, "user-agent": userAgent },
  });
  if (statusCode === 401) return { atk: "" };
  return { atk };
});
