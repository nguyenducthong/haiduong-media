import fs from "node:fs";
import { spawn } from "node:child_process";

const browserPaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
];

const browserPath = browserPaths.find(p => fs.existsSync(p));
const port = 9888;
const userDataDir = "C:\\Windows\\Temp\\cdp_test_suite_" + Date.now();

const proc = spawn(browserPath, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "about:blank"
], { stdio: "ignore" });

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

const testUrls = [
  "http://127.0.0.1:5173/tin-tuc",
  "http://127.0.0.1:5173/dich-vu-facebook/dich-vu-len-tich-xanh-facebook",
  "http://127.0.0.1:5173/dich-vu-facebook/lay-lai-facebook-bi-hack",
  "http://127.0.0.1:5173/dich-vu-facebook/bao-ve-ban-quyen-facebook-rights-manager",
  "http://127.0.0.1:5173/dich-vu-facebook",
  "http://127.0.0.1:5173/admin/dich-vu-facebook",
  "http://127.0.0.1:5173/admin",
  "http://127.0.0.1:5173/"
];

async function runSuite() {
  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    await wait(300);
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch {}
  }

  if (!wsUrl) {
    console.error("Could not connect to browser CDP");
    proc.kill();
    process.exit(1);
  }

  console.log("=== BẮT ĐẦU LIVE BROWSER TEST TOÀN DIỆN ===");
  const results = [];

  for (const url of testUrls) {
    const targetRes = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
    const targetData = await targetRes.json();
    const pageWs = new WebSocket(targetData.webSocketDebuggerUrl);
    await new Promise(r => { pageWs.onopen = r; });

    let id = 1;
    const errors = [];
    const warnings = [];

    pageWs.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
        errors.push(msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(" "));
      }
      if (msg.method === "Runtime.exceptionThrown") {
        errors.push(`${msg.params.exceptionDetails?.text} ${msg.params.exceptionDetails?.exception?.description || ""}`);
      }
    };

    function sendPage(method, params = {}) {
      pageWs.send(JSON.stringify({ id: id++, method, params }));
    }

    sendPage("Runtime.enable");
    sendPage("Page.enable");
    sendPage("Log.enable");
    sendPage("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    sendPage("Page.navigate", { url });
    await wait(3000);

    results.push({
      url,
      passed: errors.length === 0,
      errorCount: errors.length,
      errors
    });

    console.log(`${errors.length === 0 ? "✅ PASS" : "❌ FAIL"} - ${url} (Errors: ${errors.length})`);
    if (errors.length > 0) {
      errors.forEach(e => console.log(`   -> ${e.slice(0, 150)}...`));
    }

    pageWs.close();
  }

  proc.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}

  console.log("\n=== TỔNG KẾT LIVE TEST ===");
  const allPassed = results.every(r => r.passed);
  console.log(`Kết quả: ${allPassed ? "100% PASSED - TOÀN BỘ TRANG SẠCH LỖI" : "CÓ TRANG FAILED"}`);
  process.exit(allPassed ? 0 : 1);
}

runSuite().catch(err => {
  console.error("Suite failed:", err);
  proc.kill();
  process.exit(1);
});

