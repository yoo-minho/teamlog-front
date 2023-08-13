export default defineNuxtRouteMiddleware((to, from) => {
  const idx = (n: string) =>
    ["team", "blog", "post", "stat", "my"].findIndex((v) => v === n);
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
