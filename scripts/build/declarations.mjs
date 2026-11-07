import { execFileSync } from "node:child_process"
import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { withJsExtension } from "./specifiers.mjs"

// `from "./menu"` and `import("./menu")` in a declaration file. tsc also
// writes `import(".")` when an inferred type comes from the package index.
const relativeImport = /(\bfrom\s*|\bimport\s*\(\s*)(["'])(\.{1,2}(?:\/[^"']*)?)\2/g

/**
 * Emits `.d.ts` files with the package's own TypeScript and `tsconfig.json`,
 * then adds `.js` to relative imports so the types also resolve under
 * `moduleResolution: "node16"`. `project` names another tsconfig in the package.
 */
function emitDeclarations({ packageDir, sourceDir, outDir, project = "tsconfig.json" }) {
  const tsc = createRequire(path.join(packageDir, "package.json")).resolve("typescript/bin/tsc")
  // Emit settings live here, not in a `tsconfig.build.json` per package, so
  // each package keeps one `tsconfig.json` that typechecks with `noEmit`.
  const emitFlags = ["--noEmit", "false", "--declaration", "--emitDeclarationOnly"]
  const paths = ["--rootDir", sourceDir, "--outDir", outDir]
  execFileSync(process.execPath, [tsc, "-p", project, ...emitFlags, ...paths], {
    cwd: packageDir,
    stdio: "inherit",
  })
  for (const file of listDeclarationFiles(outDir)) addJsExtensions(file)
}

function listDeclarationFiles(outDir) {
  return readdirSync(outDir, { recursive: true })
    .filter((file) => file.endsWith(".d.ts"))
    .map((file) => path.join(outDir, file))
}

function addJsExtensions(file) {
  const fromDir = path.dirname(file)
  const source = readFileSync(file, "utf8")
  const rewritten = source.replace(relativeImport, (_, keyword, quote, specifier) => {
    const resolved = withJsExtension(specifier, fromDir, [".d.ts"])
    return `${keyword}${quote}${resolved}${quote}`
  })
  if (rewritten !== source) writeFileSync(file, rewritten)
}

export { emitDeclarations }
