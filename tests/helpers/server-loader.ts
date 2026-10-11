import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = process.cwd();
const externalRequire = createRequire(path.join(root, "package.json"));

/** Isolated module graph: database/network modules are never loaded by these tests. */
export function createServerLoader(
  db: Record<string, unknown>,
  session: { status: string; id?: number } | null = { status: "ok", id: 1 },
) {
  const modules = new Map<string, { exports: Record<string, unknown> }>();
  const invalidations: string[] = [];
  const stubs: Record<string, unknown> = {
    "server-only": {},
    "next/cache": {
      revalidatePath: (route: string) => invalidations.push(route),
    },
    react: { cache: (operation: unknown) => operation },
    [path.join(root, "server/db/prisma.ts")]: { prisma: db },
    [path.join(root, "server/auth/session.ts")]: {
      ReadSession: async () => session,
    },
  };
  function load(request: string, from = root): Record<string, unknown> {
    if (Object.hasOwn(stubs, request))
      return stubs[request] as Record<string, unknown>;
    if (
      !request.startsWith(".") &&
      !request.startsWith("@/") &&
      !path.isAbsolute(request)
    )
      return externalRequire(request);
    const base = request.startsWith("@/")
      ? path.join(root, request.slice(2))
      : path.resolve(from, request);
    const file = [
      base,
      `${base}.ts`,
      `${base}.tsx`,
      path.join(base, "index.ts"),
    ].find(
      (candidate) =>
        fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
    );
    if (!file) throw new Error(`Unresolved test module: ${request}`);
    if (Object.hasOwn(stubs, file))
      return stubs[file] as Record<string, unknown>;
    if (file.includes(`${path.sep}generated${path.sep}`))
      throw new Error("Tests must not load a live Prisma client");
    const cached = modules.get(file);
    if (cached) return cached.exports;
    const loadedModule = { exports: {} as Record<string, unknown> };
    modules.set(file, loadedModule);
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText;
    const run = vm.runInThisContext(
      `(function(require,module,exports){${code}\n})`,
      { filename: file },
    );
    run(
      (specifier: string) => load(specifier, path.dirname(file)),
      loadedModule,
      loadedModule.exports,
    );
    return loadedModule.exports;
  }
  return { load, invalidations };
}
