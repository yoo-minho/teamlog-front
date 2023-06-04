export default defineNuxtRouteMiddleware((to, from) => {
  const idx = (n: string) =>
    ["@teamId-blog", "@teamId-post", "@teamId-stat"].findIndex((v) => v === n);
  const toIdx = idx(String(to.name));
  const fromIdx = idx(String(from.name));
  if (fromIdx === -1) {
    if (to.meta.pageTransition && to.meta.pageTransition !== true) {
      to.meta.pageTransition.name = "";
      return;
    }
  }
  if (to.meta.pageTransition && to.meta.pageTransition !== true) {
    to.meta.pageTransition.name =
      toIdx > fromIdx ? "slide-right" : "slide-left";
  }
  if (from.meta.pageTransition && from.meta.pageTransition !== true) {
    from.meta.pageTransition.name =
      toIdx > fromIdx ? "slide-left" : "slide-right";
  }
});
