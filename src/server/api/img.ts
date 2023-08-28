import fetch from "node-fetch";
import sharp from "sharp";
import fs from "fs/promises";

export default defineEventHandler(async (event) => {
  const { name, path } = getQuery(event);

  const imageFilename = `${name}.jpg`; // 저장할 이미지 파일명
  const thumbnailFilename = `${name}_thumb.jpg`; // 썸네일 이미지 파일명
  await downloadImage(String(path), imageFilename);
  return await createThumbnail(imageFilename, thumbnailFilename);
});

async function downloadImage(url: string, filename: string) {
  const response = await fetch("https:" + url);
  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(filename, Buffer.from(arrayBuffer));
}

async function createThumbnail(inputPath: string, outputPath: string) {
  return await sharp(inputPath)
    .resize({ width: 48, height: 48, fit: sharp.fit.inside })
    .toFile(outputPath);
}
