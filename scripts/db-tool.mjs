import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const action = process.argv[2] || "export-local";

function findActiveLocalDb() {
  const d1Dir = path.join(projectRoot, ".wrangler", "state", "v3", "d1", "miniflare-D1DatabaseObject");
  if (!fs.existsSync(d1Dir)) return null;

  const files = fs.readdirSync(d1Dir).filter((f) => f.endsWith(".sqlite") && f !== "metadata.sqlite");
  for (const file of files) {
    const fullPath = path.join(d1Dir, file);
    try {
      const db = new DatabaseSync(fullPath);
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='site_content'").all();
      if (tables.length > 0) {
        const count = db.prepare("SELECT count(*) as c FROM site_content").get();
        if (count && count.c > 0) {
          return fullPath;
        }
      }
    } catch {}
  }
  return null;
}

if (action === "export-local") {
  const dbPath = findActiveLocalDb();
  if (!dbPath) {
    console.error("❌ Khong tim thay database local co du lieu trong .wrangler/state.");
    process.exit(1);
  }

  console.log(`🔍 Tim thay database local tai: ${path.basename(dbPath)}`);
  const db = new DatabaseSync(dbPath);
  const rows = db.prepare("SELECT key, data, updated_by, updated_at FROM site_content").all();

  // 1. Export ra file SQL chuan
  let sqlContent = "PRAGMA defer_foreign_keys=TRUE;\n";
  sqlContent += "CREATE TABLE IF NOT EXISTS site_content (\n";
  sqlContent += "  key TEXT PRIMARY KEY,\n";
  sqlContent += "  data TEXT NOT NULL,\n";
  sqlContent += "  updated_by TEXT,\n";
  sqlContent += "  updated_at INTEGER NOT NULL\n";
  sqlContent += ");\n";

  for (const row of rows) {
    const escapedKey = String(row.key).replace(/'/g, "''");
    const escapedData = String(row.data).replace(/'/g, "''");
    const escapedUpdatedBy = row.updated_by ? `'${String(row.updated_by).replace(/'/g, "''")}'` : "NULL";
    const updatedAt = Number(row.updated_at) || Date.now();
    sqlContent += `INSERT OR REPLACE INTO site_content (key, data, updated_by, updated_at) VALUES ('${escapedKey}', '${escapedData}', ${escapedUpdatedBy}, ${updatedAt});\n`;
  }

  const sqlOut = path.join(projectRoot, "backup_data.sql");
  fs.writeFileSync(sqlOut, sqlContent, "utf-8");

  // 2. Export ra file JSON tien dung
  const jsonContent = {};
  for (const row of rows) {
    try {
      jsonContent[row.key] = JSON.parse(row.data);
    } catch {
      jsonContent[row.key] = row.data;
    }
  }
  const jsonOut = path.join(projectRoot, "backup_data.json");
  fs.writeFileSync(jsonOut, JSON.stringify(jsonContent, null, 2), "utf-8");

  console.log(`✅ Xuat du lieu thanh cong!`);
  console.log(`   📄 File SQL: ${sqlOut} (${(fs.statSync(sqlOut).size / 1024).toFixed(1)} KB)`);
  console.log(`   📄 File JSON: ${jsonOut} (${(fs.statSync(jsonOut).size / 1024).toFixed(1)} KB)`);
} else if (action === "export-remote") {
  console.log("🌐 Dang xuat du lieu tu Cloudflare D1 Remote...");
  const res = spawnSync("npx", ["wrangler", "d1", "export", "haiduong-media-db", "--remote", "--output=./backup_data.sql"], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
  });
  if (res.status === 0) {
    console.log("✅ Xuat D1 Remote thanh cong vao backup_data.sql!");
  }
} else if (action === "import-remote") {
  const sqlFile = process.argv[3] || "./backup_data.sql";
  console.log(`🌐 Dang nap file ${sqlFile} len Cloudflare D1 Remote...`);
  spawnSync("npx", ["wrangler", "d1", "execute", "haiduong-media-db", "--remote", `--file=${sqlFile}`], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
  });
}
