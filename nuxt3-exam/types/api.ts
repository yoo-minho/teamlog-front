import { BlogType, Link } from "./common";

export type TeamFilter = {
  tag?: Ref<string>;
  page: Ref<number>;
  sort?: Ref<string>;
};

export type TeamCreateJson = {
  domain: string;
  title: string;
  description: string;
  tags: string[];
  links: Link[];
};

export type TeamCountResultType = {
  groupCount: number;
  linkCount: number;
  postCount: number;
  linkCountByPlatform: { _count: number; type: BlogType }[];
};

export type BlogFilter = { tag?: Ref<string>; page?: Ref<number> };

export type OGSResultType = {
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: { url: string };
  success: boolean;
  message?: string;
};

export type SearchParam = {
  teamId?: Ref<string>;
  tag?: Ref<string>;
  q?: Ref<string>;
  page?: Ref<number>;
};
