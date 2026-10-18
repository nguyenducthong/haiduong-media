import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { localizeArticleImages } from "../lib/image-downloader.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.resolve(__dirname, "../data/enterprises.json");

async function main() {
  console.log("Loading enterprises.json...");
  const articles = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  console.log(`Processing ${articles.length} articles for image localization...`);

  const updatedArticles = [];
  for (let i = 0; i < articles.length; i++) {
    const art = articles[i];
    console.log(`[${i + 1}/${articles.length}] Localizing images for: ${art.slug}`);
    const localized = await localizeArticleImages(art);
    updatedArticles.push(localized);
  }

  fs.writeFileSync(dataFile, JSON.stringify(updatedArticles, null, 2), "utf8");
  console.log("Migration complete! Saved updated enterprises.json.");
}

main().catch(console.error);
