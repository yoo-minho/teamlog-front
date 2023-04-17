export const highlights = (data: { title: string }[], words: string[] | string) => {
  let wordArr = [] as string[];
  if (typeof words === 'string') {
    wordArr = words.split('|').filter((word) => !!word);
  } else {
    wordArr = words;
  }
  return data.map((v) => ({ ...v, title: highlight(v.title, wordArr) }));
};

export const highlight = (t: string, words: string[]) => {
  words.forEach((word) => (t = t.replace(new RegExp(word, 'ig'), (v) => `<mark>${v}</mark>`)));
  return t;
};
