import { defineEventHandler, H3Event, parseCookies, setCookie } from "h3";

export default defineEventHandler(async (event) => {
  const currentRtk = getCookie(event, "refresh-token");
  console.log("@@@@@@@@@@@@@ currentRtk", { currentRtk });
  const config = useRuntimeConfig();
  const { statusCode, atk, rtk } = await $fetch<{
    statusCode: number;
    atk: string;
    rtk: string;
  }>("auth/refresh", {
    baseURL: config.public.apiBase,
    headers: { Authorization: `Bearer ${currentRtk}` },
  });
  console.log("@@@@@@@@@@@@@", { statusCode, atk, rtk, event });
  setCookie(event, "123", "456");
  setCookie(event, "1231", "4561");

  if (statusCode === 401 || rtk === "") {
    setCookie(event, "refresh-token", "", {
      path: "/",
      httpOnly: true,
    });
    return { atk: "" };
  }
  setCookie(event, "refresh-token", rtk, {
    path: "/",
    httpOnly: true,
  });
  return { atk, rtk };
});
