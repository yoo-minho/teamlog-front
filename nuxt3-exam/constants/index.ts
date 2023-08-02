export const POST_TAG = [
  { label: "GPT", value: "gpt" },
  { label: "회고", value: "회고|결산|.log|정산" },
  { label: "인프콘", value: "인프콘" },
  { label: "글또", value: "글또" },
  { label: "이직", value: "이직" },
  { label: "테스트", value: "테스트|test" },
  { label: "sql", value: "sql|쿼리|query" },
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
  noti: "알림",
  my: "나의 공간",
} as { [key: string]: string };
export const TAB_LABEL_IN_TEAM = [
  { name: "blog", label: `블로그` },
  { name: "post", label: `포스트` },
  { name: "stat", label: `통계` },
];
