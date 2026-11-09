// Builds a Svelte package in the current directory into `dist` with
// svelte-package, which ships `.svelte` files as source and strips the types
// from `.ts` and `.svelte.ts` modules. Relative imports then get the `.js`
// extension Node's resolver needs, like build-package.mjs gives the other
// packages, and the published manifest is checked the same way.
//
//   node ../../scripts/build/build-svelte-package.mjs
import { execFileSync } from "node:child_process"
import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"
import { findPublishProblems } from "./publish-manifest.mjs"
import { isRelative, withJsExtension } from "./specifiers.mjs"

const packageDir = process.cwd()
const outDir = path.join(packageDir, "dist")
rmSync(outDir, { recursive: true, force: true })
execFileSync("npx", ["svelte-package", "--input", "src", "--output", "dist"], {
  stdio: "inherit",
})

// `from "./context"` becomes `from "./context.js"` and `"../use-primitive.svelte"`
// becomes `"../use-primitive.svelte.js"`, in modules and in the scripts of
// `.svelte` files. Imports that name a file, like a component, stay.
const specifier = /(\bfrom\s*|\bimport\s*\(?\s*)(["'])([^"']+)\2/g
for (const entry of readdirSync(outDir, {
  recursive: true,
  withFileTypes: true,
})) {
  if (!entry.isFile() || !/\.(js|svelte)$/.test(entry.name)) {
    continue
  }
  const file = path.join(entry.parentPath, entry.name)
  const source = readFileSync(file, "utf8")
  const names = (target) => existsSync(path.resolve(path.dirname(file), target))
  const rewritten = source.replace(specifier, (match, lead, quote, target) =>
    isRelative(target) && !names(target)
      ? `${lead}${quote}${withJsExtension(target, path.dirname(file), [".js", ".d.ts"])}${quote}`
      : match
  )
  if (rewritten !== source) {
    writeFileSync(file, rewritten)
  }
}

const problems = findPublishProblems(packageDir)
if (problems.length) {
  console.error(
    `The published package.json doesn't match the build:\n  ${problems.join("\n  ")}`
  )
  process.exitCode = 1
}
