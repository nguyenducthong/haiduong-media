import fs from "node:fs";
import { spawn } from "node:child_process";

const browserPaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
];

const browserPath = browserPaths.find(p => fs.existsSync(p));
if (!browserPath) {
  console.error("No browser found");
  process.exit(1);
}

const targetUrl = process.argv[2] || "http://127.0.0.1:5173/dich-vu-facebook/dich-vu-len-tich-xanh-facebook";
console.log(`Starting headless browser test on: ${targetUrl}`);

const port = 9333;
const userDataDir = "C:\\Windows\\Temp\\cdp_test_profile_" + Date.now();

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

async function run() {
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
    console.error("Failed to connect to browser CDP port " + port);
    proc.kill();
    process.exit(1);
  }

  console.log("Connected to CDP:", wsUrl);
  const ws = new WebSocket(wsUrl);

  const errors = [];
  const warnings = [];

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  function send(method, params = {}) {
    const id = msgId++;
    ws.send(JSON.stringify({ id, method, params }));
    return id;
  }

  // Create new page target
  const targetRes = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  const targetData = await targetRes.json();
  const pageWsUrl = targetData.webSocketDebuggerUrl;

  const pageWs = new WebSocket(pageWsUrl);
  await new Promise(r => { pageWs.onopen = r; });

  function sendPage(method, params = {}) {
    pageWs.send(JSON.stringify({ id: msgId++, method, params }));
  }

  pageWs.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.consoleAPICalled") {
      const type = msg.params.type;
      const text = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(" ");
      if (type === "error") {
        errors.push(`[Console Error] ${text}`);
      } else if (type === "warning") {
        warnings.push(`[Console Warn] ${text}`);
      }
    }
    if (msg.method === "Runtime.exceptionThrown") {
      errors.push(`[Runtime Exception] ${msg.params.exceptionDetails?.text} ${msg.params.exceptionDetails?.exception?.description || ""}`);
    }
  };

  sendPage("Runtime.enable");
  sendPage("Page.enable");
  sendPage("Log.enable");

  console.log("Navigating to:", targetUrl);
  sendPage("Page.navigate", { url: targetUrl });

  // Wait 4 seconds for page render & React hydration
  await wait(4000);

  console.log("\n================ TEST RESULTS ================");
  console.log(`Total Errors: ${errors.length}`);
  console.log(`Total Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log("\n❌ ERRORS FOUND:");
    errors.forEach((err, idx) => {
      console.log(`${idx + 1}. ${err}`);
    });
  } else {
    console.log("\n✅ NO RUNTIME ERRORS OR HYDRATION MISMATCH FOUND!");
  }

  if (warnings.length > 0) {
    console.log("\n⚠️ WARNINGS:");
    warnings.slice(0, 10).forEach((w, idx) => console.log(`${idx + 1}. ${w}`));
  }

  // Check DOM structure for overlap / broken layout
  sendPage("Runtime.evaluate", {
    expression: `(() => {
      const title = document.title;
      const text = document.body.innerText.slice(0, 300);
      const errorDialog = document.querySelector('nextjs-portal, [data-nextjs-dialog-overlay]');
      return { title, errorDialogPresent: !!errorDialog };
    })()`,
    returnByValue: true
  });

  await wait(1000);

  pageWs.close();
  ws.close();
  proc.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}

  process.exit(errors.length > 0 ? 1 : 0);
}

run().catch(err => {
  console.error("Test script failed:", err);
  try { proc.kill(); } catch {}
  process.exit(1);
});
