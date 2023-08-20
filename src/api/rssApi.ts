import { Link, RssItem, ScrapItem } from "@/types/common";
import PostAPI from "./postApi";
import { pipe } from "@/utils/CommUtil";

const isProd = process.env.NODE_ENV === "production";

export default {
  async scrap(_link: Link) {
    const scrapUrl = _link.rssUrl || _link.url;
    if (!_link.id) {
      throw Error("링크 아이디가 유효하지 않습니다!");
    }
    if (!scrapUrl) {
      throw Error("링크 유알엘이 유효하지 않습니다!");
    }

    const config = useRuntimeConfig();
    const data = await $fetch("rss", {
      baseURL: config.public.apiBase[isProd ? "prod" : "dev"],
      method: "post",
      body: {
        linkId: _link.id,
        url: scrapUrl,
        lastPostCreatedAt: _link.lastPostCreatedAt,
      },
    });
    const { items } = data as any;
    if (items.length === 0) return;
    await PostAPI.createPosts(_link.id, convertItem(items, scrapUrl));
  },
  async scrapPost(linkId: number, url: string, lastPostCreatedAt?: Date) {
    const config = useRuntimeConfig();
    const data = await $fetch("rss/post", {
      baseURL: config.public.apiBase[isProd ? "prod" : "dev"],
      method: "post",
      body: { linkId, url, lastPostCreatedAt },
    });
    console.log({ data });
  },
};

function convertItem(_items: RssItem[], scrapUrl: string): ScrapItem[] {
  return _items.map(({ title, description, content, created, link }) => {
    const _description = pipe(
      htmlDecode,
      htmlDecode,
      removeBlank,
      removeNewLine,
      removeHtmlTag,
      trim,
      substring100
    )(description || content || "");
    return {
      title: substring50(
        scrapUrl.includes("twitch") ? decodeHtmlEntity(title) : title
      ),
      description: _description,
      created,
      createdAt: new Date(created),
      url: link,
    };
  });
}

function trim(input: string) {
  return input.trim();
}

function htmlDecode(input: string): string {
  const doc = new DOMParser().parseFromString(input, "text/html");
  const elements =
    doc.documentElement.getElementsByClassName("revenue_unit_wrap");
  while (elements.length > 0) {
    elements[0].parentNode?.removeChild(elements[0]);
  }
  return doc.documentElement.textContent || "";
}

function removeHtmlTag(input: string) {
  return input.replace(/<[^>]*>?/g, "");
}

function removeBlank(input: string) {
  return input.replace(/^\s+|\s+$/gm, "");
}

function removeNewLine(input: string) {
  return input.replace(/\n/g, " ");
}

function substring50(input: string) {
  return (
    input.substring(0, 40) +
    removeEmojiUnicode(input.substring(40)).substring(0, 10)
  );
}

function substring100(input: string) {
  return (
    input.substring(0, 90) +
    removeEmojiUnicode(input.substring(90)).substring(0, 10)
  );
}

function removeEmojiUnicode(str: string) {
  return [...str].map((v) => (v === v.charAt(0) ? v : "")).join("");
}

function decodeHtmlEntity(input: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = input;
  return textarea.value;
}
