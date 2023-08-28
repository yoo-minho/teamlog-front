import platformArray from "@/data/platform.json";
import { BlogType } from "@/types/common";

export const getBlogType = (url = ""): BlogType =>
  (platformArray
    .map((p) => p.type)
    .find((platform) => url.toUpperCase().includes(platform)) ||
    "RSS") as BlogType;

export const getBlogImagePath = (type: BlogType) => {
  const target = platformArray.filter((p) => p.type === type?.toUpperCase());
  return target.length > 0 ? target[0].path : "";
};

export const getImage = (path: string) =>
  new URL(
    `../assets/images/${path || "platform/rss.png"}`,
    import.meta.url
  ).toString();

export const getImageByBlogType = (type: BlogType): string =>
  getImage(getBlogImagePath(type));

export const isTextImage = (url?: string) => {
  if (!url) return true;
  if (url.endsWith(".ico")) return true;
  switch (url) {
    case "https://images.velog.io/velog.png":
    case "https://t1.daumcdn.net/tistory_admin/static/images/openGraph/opengraph.png":
    case "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Ftistory_admin%2Fstatic%2Fmanage%2Fimages%2Fr3%2Fdefault_L.png":
      return true;
    default:
      return false;
  }
};

export const thumbImg = (url?: string, size = 32) => {
  if (!url) return "";
  if (!url.includes("http")) return url;
  url = url.replace("//img1.daumcdn.net/thumb/C400x400/?fname=", "");
  url = url.replace("//img1.daumcdn.net/thumb/C400x400.fjpg/?fname=", "");
  return `https://img1.daumcdn.net/thumb/C${size}x${size}/?fname=${url}`;
};
