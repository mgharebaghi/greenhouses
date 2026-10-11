import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

function walk(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const file = `${folder}/${entry.name}`;
    if (file.startsWith("app/generated/")) return [];
    return entry.isDirectory()
      ? walk(file)
      : /\.tsx?$/.test(file)
        ? [file]
        : [];
  });
}
const files = ["app", "features", "server", "shared"].flatMap(walk);
const errors = [];
const graph = new Map();
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const edges = [];
  for (const node of ast.statements) {
    if (!ts.isImportDeclaration(node) && !ts.isExportDeclaration(node))
      continue;
    const specifier = node.moduleSpecifier?.text;
    if (!specifier) continue;
    const typeOnly = node.isTypeOnly || node.importClause?.isTypeOnly;
    const target = specifier.startsWith("@/")
      ? specifier.slice(2)
      : specifier.startsWith(".")
        ? path.posix.normalize(`${path.posix.dirname(file)}/${specifier}`)
        : null;
    if (target) {
      const resolved = [
        target,
        `${target}.ts`,
        `${target}.tsx`,
        `${target}/index.ts`,
      ].find((candidate) => files.includes(candidate));
      if (resolved && !typeOnly) edges.push(resolved);
    }
    const pure =
      /\/(schema|domain|types|exports)\//.test(file) ||
      /shared\/(validation|contracts|table|forms)\//.test(file);
    if (
      pure &&
      !typeOnly &&
      /(?:\/actions$|\/server(?:\/|$)|^next(?:\/|$)|generated\/prisma)/.test(
        specifier,
      )
    )
      errors.push(`${file}: pure code depends on ${specifier}`);
    if (
      file.startsWith("shared/") &&
      target &&
      /^(features|server|app)\//.test(target)
    )
      errors.push(`${file}: shared code depends on ${target}`);
    if (
      file.includes("/components/") &&
      target &&
      (/^server\/db\//.test(target) ||
        /\/server\//.test(target) ||
        /generated\/prisma/.test(target))
    )
      errors.push(`${file}: UI bypasses the action/DTO boundary (${target})`);
    if (file.startsWith("server/") && target && /\/components\//.test(target))
      errors.push(`${file}: infrastructure imports UI (${target})`);
  }
  graph.set(file, edges);
  if (/features\/[^/]+\/server\/(create|read|update|delete)\.ts$/.test(file)) {
    for (const node of ast.statements) {
      if (
        ts.isFunctionDeclaration(node) &&
        node.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
        )
      ) {
        if (!node.body?.getText(ast).includes("await requireSession()"))
          errors.push(
            `${file}: ${node.name?.text} has no authentication guard`,
          );
      }
    }
  }
  if (
    file.includes("/services/") ||
    /features\/(owners|greenhouse|varities|seedPackage|seedPlanting|seedWarehousing|startSeedlingCycle|nurseryRooms|recoveryRoom)\//.test(
      file,
    )
  )
    errors.push(`${file}: obsolete directory name`);
}
const visited = new Set();
function visit(file, stack = []) {
  if (stack.includes(file)) {
    errors.push(
      `Runtime dependency cycle: ${[...stack.slice(stack.indexOf(file)), file].join(" -> ")}`,
    );
    return;
  }
  if (visited.has(file)) return;
  for (const child of graph.get(file) ?? []) visit(child, [...stack, file]);
  visited.add(file);
}
for (const file of files) visit(file);
if (errors.length) {
  process.stderr.write(`${errors.join("\n")}\n`);
  process.exitCode = 1;
} else
  process.stdout.write(
    `Architecture checks passed (${files.length} source files; no runtime cycles).\n`,
  );
