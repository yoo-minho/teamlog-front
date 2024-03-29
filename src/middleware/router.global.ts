export default defineNuxtRouteMiddleware((to, from) => {
  const teamId = String(to.params.teamId || "");
  const tabId = to.path.replace(`/@${teamId}/`, "");
  const fromRouteName = String(from.name || "");
  // console.log("router.global.ts", { teamId, tabId });

  const _teamId = useState<string>("teamId", () => ""); //2번째 영역은 초기값영역
  const _tabId = useState<string>("tabId", () => "");
  const _fromRouteName = useState<string>("fromRouteName", () => "");

  useState<number>("teamScrollVPos", () => 0);

  if ("" !== teamId) {
    _teamId.value = teamId;
  }
  if ("" !== tabId) {
    _tabId.value = tabId;
  }
  _fromRouteName.value = fromRouteName;
});
