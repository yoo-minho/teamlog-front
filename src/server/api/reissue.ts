const isProd = process.env.NODE_ENV === "production";

export default defineEventHandler(async (event) => {
  const currentRtk = getCookie(event, "refresh-token");
  if (currentRtk === "") {
    return { atk: "", rtk: "", message: "empty currentRtk" };
  }

  const userAgent = getRequestHeader(event, "user-agent") || "";
  const config = useRuntimeConfig();
  const { statusCode, atk, rtk, message } = await $fetch<{
    statusCode: number;
    atk: string;
    rtk: string;
    message: string;
  }>("auth/refresh", {
    baseURL: config.public.apiBase[isProd ? "prod" : "dev"],
    headers: { Authorization: `Bearer ${currentRtk}`, "user-agent": userAgent },
  });
  if (statusCode === 401 || rtk === "") {
    return { atk: "", rtk: "", message: message || "401 auth/refresh" };
  }
  return { atk, rtk };
});
