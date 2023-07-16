export function minifyStr(txt = "", n: number) {
  if (txt.length <= n) return txt;
  return txt.substring(0, n);
}

type ConvertFunction = (x: string) => string;

export const openUrl = (url: string, target?: string) =>
  window.open(url, target);
const timeout = 500;
export const delay = (delay = timeout) =>
  new Promise((res) => setTimeout(res, delay));
export const pipe =
  (...funcs: ConvertFunction[]) =>
  (v: string) =>
    funcs.reduce((res, func) => func(res), v);

export const division = (array: any[], n: number) => {
  const length = array.length;
  const divide = Math.floor(length / n) + (Math.floor(length % n) > 0 ? 1 : 0);
  const newArray = [];
  for (let i = 0; i <= divide; i++) {
    newArray.push(array.splice(0, n));
  }
  return newArray;
};
