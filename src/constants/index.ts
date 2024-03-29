export const POST_TAG = [
  { label: "회고", value: "회고|결산|.log|정산", url: "retrospect" },
  { label: "gpt", value: "gpt", url: "gpt" },
  { label: "인프콘", value: "인프콘|infcon", url: "infcon" },
  { label: "글또", value: "글또", url: "geultto" },
  { label: "이직", value: "이직", url: "change-job" },
  { label: "퇴사", value: "퇴사", url: "leave" },
  { label: "테스트", value: "테스트|test|tdd", url: "test" },
  { label: "sql", value: "sql|쿼리|query|데이터베이스", url: "sql" },
  { label: "git", value: "git|깃", url: "git" },
  { label: "aws", value: "aws|아마존", url: "aws" },
  { label: "번역", value: "번역", url: "translate" },
];
export const BLOG_TAG = [
  { type: "TISTORY", label: "티스토리", color: "#E74F05" },
  { type: "VELOG", label: "벨로그", color: "#20c997" },
  { type: "BRUNCH", label: "브런치", color: "#231F20" },
  { type: "MEDIUM", label: "미디엄", color: "#333333" },
  { type: "NAVER", label: "네이버블로그", color: "#5BC36E" },
  { type: "YOUTUBE", label: "유튜브", color: "#FE3333" },
  { type: "RSS", label: "RSS", color: "#FFB833" },
];
export const BLOG_EXPRESSION = {
  NAVER:
    /https:\/\/(m\.)?blog.naver.com\/([0-9a-zA-Z_-]*)(\/)?([0-9a-zA-Z]*)/gi,
  TISTORY: /https:\/\/([0-9a-zA-Z_-]*)\.tistory.com(\/)?([0-9a-zA-Z]*)/gi,
  VELOG: /https:\/\/velog.io\/@([0-9a-zA-Z_-]*)(\/)?([0-9a-zA-Z]*)/gi,
  BRUNCH: /https:\/\/brunch.co.kr\/@([0-9a-zA-Z_-]*)(\/)?([0-9a-zA-Z]*)/gi,
  MEDIUM: /https:\/\/medium.com\/([0-9a-zA-Z_-]*)(\/)?([0-9a-zA-Z]*)/gi,
  YOUTUBE:
    /https:\/\/www.youtube.com\/channel\/([0-9a-zA-Z_-]*)(\/)?([0-9a-zA-Z]*)/gi,
  TWITCH: /https:\/\/www.twitch.tv\/([0-9a-zA-Z_-]*)/gi,
};
export const MAINTAB_LABEL = [
  "팀로그",
  "블로그",
  "포스트",
  "알림",
  "나의 공간",
];
export const TAB_LABEL = {
  team: "팀로그",
  blog: "블로그",
  post: "포스트",
  stat: "통계",
  my: "나의 공간",
} as { [key: string]: string };
export const TAB_LABEL_IN_TEAM = [
  { name: "blog", label: `블로그` },
  { name: "post", label: `포스트` },
  { name: "stat", label: `통계` },
];
