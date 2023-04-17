import OpenGraphTagAPI from '@/api/openGraphTagApi';
import { getBlogType } from '@/util/ImageUtil';
import { minifyStr } from '@/util/CommUtil';
import { BlogType } from '@/types/common';

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
  const ogsData = await OpenGraphTagAPI.index(url);
  if (!ogsData.success) {
    return {
      error: true,
      errorMessage: ogsData.message,
      url: '',
      type: '',
      title: '',
      description: '',
      imagePath: '',
    };
  }

  return {
    error: false,
    errorMessage: '',
    url: url,
    type: getBlogType(url),
    title: minifyStr(ogsData.ogTitle, 50),
    description: minifyStr(ogsData.ogDescription, 100),
    imagePath: getOgImage(url, ogsData.ogImage),
  };
};

const getOgImage = (url: string, ogImage: { url: string }) => {
  if (ogImage instanceof Array && ogImage.length) {
    return ogImage[0].url;
  }
  return ogImage?.url || url + 'favicon.ico';
};
