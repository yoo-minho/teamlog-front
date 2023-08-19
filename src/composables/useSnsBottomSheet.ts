import { getImage } from "@/utils/ImageUtil";
import { shareKakao } from "./useKakaoApi";
import { BottomSheet, Notify } from "quasar";
import { teamSeoDesc, teamSeoTitle } from "@/constants/seo";

type SeoType = { title: string; description?: string; weeklyAvgPost?: number };

export const showBottomSheet = (props: SeoType) => {
  const { title, description, weeklyAvgPost } = props;
  const route = useRoute();
  const routeName = String(route.name || "");
  let sharedUrl = location.href;
  if (routeName === "team") sharedUrl = sharedUrl.replace("/team", "");
  if (routeName === "@teamId-post") sharedUrl = sharedUrl.replace("/post", "");
  const seoTitle = teamSeoTitle(title);
  const seoDesc = teamSeoDesc(weeklyAvgPost, description);
  BottomSheet.create({
    message: `공유하기 | ${sharedUrl}`,
    grid: false,
    actions: [
      {
        label: "Kakaotalk (카카오톡)",
        img: getImage("sns/kakao.png"),
        id: "kakao",
      },
      {
        label: "Facebook (페이스북)",
        img: getImage("sns/facebook.png"),
        id: "facebook",
      },
      {
        label: "Twitter (트위터)",
        img: getImage("sns/twitter.png"),
        id: "twitter",
      },
      {
        label: "Naver Band (네이버 밴드)",
        img: getImage("sns/band.png"),
        id: "band",
      },
      {},
      {
        label: "URL Copy",
        icon: "content_copy",
        id: "copy",
      },
      {
        label: "Share",
        icon: "share",
        id: "share",
      },
    ],
  }).onOk((action) => {
    const _sharedUrl = encodeURIComponent(sharedUrl);
    const _title = encodeURIComponent(seoTitle);
    const _description = seoDesc;
    switch (action.id) {
      case "kakao":
        shareKakao({ title: _title, description: _description });
        return;
      case "facebook":
        window.open(
          `http://www.facebook.com/sharer/sharer.php?u=${_sharedUrl}`,
          "",
          "width=400, height=500"
        );
        return;
      case "twitter":
        window.open(
          `http://twitter.com/share?url=${_sharedUrl}&text=${_title}`,
          "tweetPop",
          "width=400, height=500, scrollbars=yes"
        );
        return;
      case "band":
        window.open(
          `http://www.band.us/plugin/share?body=${_title}&route=${_sharedUrl}`,
          "shareBand",
          "width=400, height=500, resizable=yes"
        );
        return;
      case "copy":
        copyUrl(sharedUrl);
        return;
      case "share":
      default:
        shareUrl(sharedUrl);
        return;
    }
  });
};

const shareUrl = (sharedUrl: string) => {
  if (typeof navigator.share === "undefined") {
    Notify.create({
      type: "nagative",
      message: "자동 공유가 제한되는 브라우져입니다!",
    });
    return;
  }
  navigator.share({
    title: sharedUrl,
    url: sharedUrl,
  });
};

const copyUrl = async (sharedUrl: string) => {
  if (typeof navigator.clipboard === "undefined") {
    const dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = sharedUrl;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  } else {
    await navigator.clipboard.writeText(sharedUrl);
  }
  Notify.create({ type: "positive", message: "URL 복사 완료!" });
};
