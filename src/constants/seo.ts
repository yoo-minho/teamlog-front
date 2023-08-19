export const mainSeoTitle = () => `Teamlog | 모아보기 좋은 블로그 플랫폼`;
export const mainSeoDesc = () => "맘에 드는 블로그 모으니 팀이 되았네!";
export const teamSeoTitle = (title: string) => `${title} | Teamlog`;
export const teamSeoDesc = (weeklyAvgPost?: number, description?: string) => {
  const wap = weeklyAvgPost || 0;
  return (
    (+wap > 0 ? `주간 게시물 : ${wap}건 | ` : "") +
    (description || "여러분의 팀도 블로그로 만나봐요!")
  );
};
export const tagPostSeoTitle = (tag: string) =>
  `${tag} | 블로그 포스트 in 팀로그`;
export const tagPostSeoDesc = () => "키워드로 블로그 포스트 모아보기";
