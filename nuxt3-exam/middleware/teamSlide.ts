export default defineNuxtRouteMiddleware((to, from) => {
  // console.log("teamSLide from.name", from.name, from.meta);
  // console.log("teamSLide to.name", to.name, to.meta);
  // if (from.name === "team" && to.name === "@teamId-post") {
  //   from.meta = {
  //     ...from.meta,
  //     layoutTransition: {},
  //     pageTransition: {},
  //   };
  //   to.meta = {
  //     ...to.meta,
  //     layoutTransition: { name: "page" },
  //     pageTransition: { name: "" },
  //   };
  //   return;
  // }
  const idx = (n: string) =>
    ["@teamId-blog", "@teamId-post", "@teamId-stat"].findIndex((v) => v === n);
  const toIdx = idx(String(to.name));
  const fromIdx = idx(String(from.name));
  to.meta.pageTransition = { mode: "out-in" };
  from.meta.pageTransition = { mode: "out-in" };
  if (fromIdx === -1) {
    to.meta.pageTransition.name = "";
    return;
  }
  to.meta.pageTransition.name = toIdx > fromIdx ? "slide-right" : "slide-left";
  from.meta.pageTransition.name =
    toIdx > fromIdx ? "slide-left" : "slide-right";
});
