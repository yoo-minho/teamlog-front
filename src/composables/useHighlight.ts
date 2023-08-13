export const changeMarkContents = (contents: string, word: string) =>
  highlight(
    contents,
    word.split(/\s+/).filter((v) => !!v)
  );
export const highlight = (t: string, words: string[]) => {
  words.forEach(
    (word) =>
      (t = t.replace(new RegExp(word, "ig"), (v) => `<mark>${v}</mark>`))
  );
  return t;
};
