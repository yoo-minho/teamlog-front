export const getNextTab = (v: any, tabs: string[]) => {
  const isLeftSwipe = v.direction === "left";
  const route = useRoute();
  const currentTab = String(route.name).replace("@teamId-", "");
  return tabs[tabs.indexOf(currentTab) + (isLeftSwipe ? 1 : -1)] || "";
};
