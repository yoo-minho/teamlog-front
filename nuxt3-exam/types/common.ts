export type ErrorMessage = string | boolean;
export type Link = {
  id?: number;
  url: string;
  rssUrl?: string;
  title: string;
  description?: string;
  type: BlogType;
  imagePath?: string;
  scrapAt?: Date;
  lastPostCreatedAt?: Date;
};
export type LinkWrap = { link: Link };
export type GroupTagWrap = {
  tag: {
    id: number;
    name: string;
  };
};
export type Group = {
  id?: number;
  domain: string;
  title: string;
  description?: string;
  links?: LinkWrap[];
  tags?: GroupTagWrap[];
  createdAt?: Date;
  todayViews?: number;
  totalViews?: number;
  lastPostCreatedAt?: Date;
  weeklyAvgPost?: number;
};
export type GroupTag = {
  index: number;
  groupId: string;
  name: string;
};
export type Tag = {
  index?: number;
  id: string;
  name: string;
  count?: number;
};
export type RssItem = {
  created: number;
  description?: string;
  content?: string;
  link: string;
  title: string;
};
export type ScrapItem = {
  title: string;
  description: string;
  createdAt: Date;
  created: number;
  url: string;
};
export type ScrapResult = {
  linkId?: number;
  lastPostCreateAt?: Date;
};
export type Post = {
  id?: number;
  createdAt: Date;
  description?: string;
  content?: string;
  linkId: number;
  link: Link;
  url: string;
  title: string;
};
export type LastPost = {
  linkId: number;
  createdAt: Date;
  title?: string;
  dateString: string;
  agoString: string;
};
export type Days = {
  date: string;
  day: number;
  month: string;
};
export type DaysCount = Days & {
  count: number;
};
export type DaysAllCounts = {
  date: string;
  day: number;
  month: string;
  count: {
    [key: string]: number;
  };
};
export type DaysCounts = {
  date: string;
  day: number;
  month: string;
  count: number;
};
export type StackJson = {
  name: string;
  label: string;
  version: string;
  description: string;
  path: string;
  url: string;
  githubStar: string;
};
export type OrderType = 1 | -1;
export type BlogType = string & ('BRUNCH' | 'MEDIUM' | 'NAVER' | 'TISTORY' | 'VELOG' | 'TWIITCH' | 'RSS' | '');
export type TabType = string & ('GroupDetailLink' | 'GroupDetailPost' | 'GroupDetailStat');
export type MainTabType = string & (`t_0` | `t_1` | `t_2` | 't_3' | 't_4');
export type OrderOption = { label: string; value: string; order: OrderType };
export type linkCount = { linkId: number; count: number };
