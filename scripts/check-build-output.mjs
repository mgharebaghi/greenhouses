import fs from "node:fs";
import path from "node:path";

const root = ".next/standalone";
if (!fs.existsSync(root)) throw new Error("Run npm run build first.");
let bytes = 0;
const forbidden = [];
function visit(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (
      /^(?:\.env(?:\..*)?|docker\.local\.env)$/.test(entry.name) ||
      /\.(?:tar|tar\.gz|tgz)$/.test(entry.name) ||
      [".git", ".codex", ".agents"].includes(entry.name)
    )
      forbidden.push(file);
    if (entry.isDirectory()) visit(file);
    else bytes += fs.statSync(file).size;
  }
}
visit(root);
if (forbidden.length)
  throw new Error(
    `Deployment contains local artifacts: ${forbidden.join(", ")}`,
  );
if (!fs.existsSync(path.join(root, "server.js")))
  throw new Error("Standalone server is missing.");
console.log(
  `Standalone output verified: no secrets or local archives (${(bytes / 1024 / 1024).toFixed(1)} MiB).`,
);
