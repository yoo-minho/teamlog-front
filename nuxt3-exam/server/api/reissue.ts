export default defineEventHandler(async (event) => {
  const currentRtk = getCookie(event, "refresh-token");
  if (currentRtk === "") {
    return { atk: "", rtk: "", message: "empty currentRtk" };
  }

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
  if (statusCode === 401 || rtk === "") {
    return { atk: "", rtk: "", message: "401 auth/refresh" };
  }
  return { atk, rtk };
});
