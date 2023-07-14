export default defineNuxtRouteMiddleware((to) => {
  const teamId = String(to.params.teamId || "");
  const tabId = to.path.replace(`/@${teamId}/`, "");

  const _teamId = useState<string>("teamId", () => ""); //2번째 영역은 초기값영역
  const _tabId = useState<string>("tabId", () => "");

  if ("" !== teamId) {
    _teamId.value = teamId;
  }
  if ("" !== tabId) {
    _tabId.value = tabId;
  }
});
