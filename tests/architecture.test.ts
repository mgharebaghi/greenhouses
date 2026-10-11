import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { test } from "node:test";
import database from "./fixtures/database-contract.json";
import routes from "./fixtures/routes.json";

test("Prisma matches the approved read-only introspection snapshot; migrations stay unchanged", () => {
  for (const [file, expected] of Object.entries(database)) {
    // Git normalizes text line endings; Windows checkouts may use CRLF.
    const source = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
    assert.equal(
      createHash("sha256").update(source).digest("hex"),
      expected,
      file,
    );
  }
});

test("all pre-refactor routes remain available at the same paths", () => {
  for (const route of routes) assert.ok(fs.existsSync(route), route);
});

test("layer boundaries, authentication guards, and dependency cycles remain enforced", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/check-architecture.mjs"],
    { encoding: "utf8" },
  );
  assert.match(output, /Architecture checks passed/);
});
