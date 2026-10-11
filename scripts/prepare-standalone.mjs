import fs from "node:fs";
import path from "node:path";

const workspace = path.resolve(process.cwd());
const output = path.resolve(workspace, ".next/standalone");
if (
  !output.startsWith(`${workspace}${path.sep}`) ||
  !fs.existsSync(path.join(output, "server.js"))
)
  throw new Error("Missing standalone build.");
// Next explicitly copies .env files independently of tracing. Runtime secrets
// must come from the deployment environment, never from the build artifact.
for (const entry of fs.readdirSync(output, { withFileTypes: true })) {
  if (
    entry.isFile() &&
    (/^\.env(?:\..*)?$/.test(entry.name) || entry.name === "docker.local.env")
  )
    fs.unlinkSync(path.join(output, entry.name));
}
// Standalone doesn't copy assets automatically; make local start and Docker agree.
for (const [from, to] of [
  ["public", "public"],
  [".next/static", ".next/static"],
]) {
  fs.cpSync(path.join(workspace, from), path.join(output, to), {
    recursive: true,
  });
}
