export const mainSeoTitle = (tab: string) =>
  `팀로그 | 모아보기 좋은 팀 블로그 플랫폼` +
  (tab !== "" && tab !== "team" ? ` - ${tab}` : "");
export const mainSeoDesc = () =>
  "맘에 드는 블로그 모으면 팀 블로그가 됩니다! 티스토리, 벨로그, 브런치, 미디엄, 네이버블로그, 유튜브 상관없이 팀 블로그 만들기";
export const teamSeoTitle = (title: string) => `${title} - 팀 블로그 | 팀로그`;
export const teamSeoDesc = (weeklyAvgPost?: number, description?: string) => {
  const wap = weeklyAvgPost || 0;
  return (
    (+wap > 0 ? `주간 게시물 : ${wap}건 | ` : "") +
    (description || "여러분도 팀 블로그를 만들어 보세요!")
  );
};
export const tagPostSeoTitle = (routeName: string, tag: string) => {
  if ("team" === routeName) return `${tag} - 팀 블로그 in 팀로그`;
  if ("blog" === routeName) return `${tag} - 플랫폼 블로그 in 팀로그`;
  if ("post" === routeName) return `${tag} - 블로그 포스트 in 팀로그`;
  return `${routeName} - ${tag} - 팀로그`;
};
export const tagPostSeoDesc = (routeName: string) => {
  if ("team" === routeName) return `해시태그로 팀 블로그 모아보기`;
  if ("blog" === routeName) return `블로그 플랫폼별 블로그 모아보기`;
  if ("post" === routeName) return `키워드로 블로그 포스트 모아보기`;
  return `블로그 모아보기`;
};
