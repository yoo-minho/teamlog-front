import { BlogType, LinkWrap } from '@/types/common';

export const getPlatformStat = (_links: LinkWrap[]) => {
  const result: { type: BlogType; _count: number }[] = [];
  if (!_links || _links.length === 0) {
    return result;
  }

  const counts = {} as { [key: string]: number };
  _links.forEach(({ link: { type } }) => (counts[type] = (counts[type] || 0) + 1));
  Object.keys(counts).forEach((type) => {
    const _type = type as BlogType;
    result.push({ type: _type, _count: counts[type] });
  });
  result.sort((a, b) => b._count - a._count);
  return result;
};
