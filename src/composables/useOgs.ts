import OpenGraphTagAPI from "@/api/openGraphTagApi";
import { getBlogType } from "@/utils/ImageUtil";
import { minifyStr } from "@/utils/CommUtil";
import { BlogType } from "@/types/common";

type OGSOutput = {
  error: boolean;
  errorMessage: string;
  url: string;
  type: BlogType;
  title: string;
  description: string;
  imagePath: string;
};

export const scrapOGS = async (url: string): Promise<OGSOutput> => {
  const { data: ogsData } = await OpenGraphTagAPI.index(url);
  const { success, message, ogTitle, ogDescription, ogImage } =
    ogsData.value || {};
  if (!success) {
    return {
      error: true,
      errorMessage: message || "",
      url: "",
      type: "",
      title: "",
      description: "",
      imagePath: "",
    };
  }

  return {
    error: false,
    errorMessage: "",
    url: url,
    type: getBlogType(url),
    title: minifyStr(ogTitle, 50),
    description: minifyStr(ogDescription, 100),
    imagePath: getOgImage(url, ogImage || { url: "" }),
  };
};

const getOgImage = (url: string, ogImage: { url: string }) => {
  if (ogImage instanceof Array && ogImage.length) {
    return ogImage[0].url;
  }
  return ogImage?.url || url + "favicon.ico";
};
