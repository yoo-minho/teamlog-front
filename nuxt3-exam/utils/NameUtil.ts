export const skipBlogName = (v: string) =>
  v
    .replace(' - velog', '')
    .replace(' – Medium', '')
    .replace(' : 네이버 블로그', '')
    .replace('의 브런치', '')
    .replace('님의 블로그', '');
