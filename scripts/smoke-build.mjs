import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const probe = net.createServer();
await new Promise((resolve) => probe.listen(0, "127.0.0.1", resolve));
const port = probe.address().port;
await new Promise((resolve) => probe.close(resolve));
const server = spawn(
  process.execPath,
  [path.resolve(".next/standalone/server.js")],
  {
    env: {
      ...process.env,
      PORT: String(port),
      HOSTNAME: "127.0.0.1",
      NEXT_TELEMETRY_DISABLED: "1",
      // These checks are deliberately anonymous and never query/write a live database.
      DATABASE_URL:
        "sqlserver://127.0.0.1:1;database=smoke;user=smoke;password=unused;encrypt=false",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let log = "";
server.stdout.on("data", (chunk) => {
  log += chunk;
});
server.stderr.on("data", (chunk) => {
  log += chunk;
});
const origin = `http://127.0.0.1:${port}`;
try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const result = await fetch(origin);
      ready = result.status === 200;
      if (ready) break;
    } catch {
      /* Server may still be starting. */
    }
    await delay(250);
  }
  assert.ok(ready, `Standalone failed to start: ${log}`);
  const home = await fetch(origin);
  const html = await home.text();
  assert.match(html, /نام کاربری/);
  const css = html.match(/href="([^"]+\.css(?:\?[^"]*)?)"/);
  assert.ok(css, "Login stylesheet is missing");
  assert.equal(
    (await fetch(new URL(css[1].replaceAll("&amp;", "&"), origin))).status,
    200,
  );
  assert.equal((await fetch(`${origin}/fakoor-logo.png`)).status, 200);
  assert.equal((await fetch(`${origin}/icon`)).status, 200);
  for (const route of ["/dashboard/people", "/dashboard/orders"]) {
    const result = await fetch(`${origin}${route}`, { redirect: "manual" });
    assert.equal(result.status, 307);
    assert.equal(result.headers.get("location"), "/");
  }
  for (const route of [
    "/public/scan/orders/0",
    "/public/scan/seed-package/0",
  ]) {
    assert.equal((await fetch(`${origin}${route}`)).status, 404);
  }
  console.log(
    "Production smoke passed: login, CSS, logo, icon, protected routes and invalid public QR IDs; no live database.",
  );
} finally {
  server.kill();
  await new Promise((resolve) => {
    if (server.exitCode !== null) resolve();
    else server.once("exit", resolve);
  });
}
