import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("data/enterprises.json", "utf8"));
let contentImages = 0;
let base64Images = 0;

data.forEach((a) => {
  if (a.content) {
    const matches = a.content.match(/src="([^"]+)"/g) || [];
    matches.forEach((m) => {
      const src = m.replace(/^src="/, "").replace(/"$/, "");
      if (src.startsWith("http")) {
        contentImages++;
        console.log("Remote content image in", a.slug, ":", src);
      } else if (src.startsWith("data:")) {
        base64Images++;
      }
    });
  }
});

console.log("Total remote content images:", contentImages);
console.log("Total base64 content images:", base64Images);
