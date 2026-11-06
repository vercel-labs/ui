import { build } from "esbuild"
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { emitDeclarations } from "./declarations.mjs"
import { transpile } from "./transpile.mjs"

/**
 * Builds the package's Nuxt module from `nuxt/` into `dist/nuxt`, beside
 * `entries.json`, which lists what each component entry gives a Nuxt app.
 */
async function buildNuxtModule({ packageDir, outDir }) {
  const sourceDir = path.join(packageDir, "nuxt")
  const moduleDir = path.join(outDir, "nuxt")
  await transpile({ sourceDir, outDir: moduleDir })
  emitDeclarations({ packageDir, sourceDir, outDir: moduleDir, project: "nuxt/tsconfig.json" })
  const entries = await listNuxtEntries(packageDir)
  writeFileSync(path.join(moduleDir, "entries.json"), `${JSON.stringify(entries, null, 2)}\n`)
}

/**
 * Each entry in `src` with the components it exports and its other values,
 * like `{ from: "@ui-sdk/vue/dialog", components: ["Dialog", …], imports:
 * ["createDialogController"] }`. The root entry re-exports the others, so it
 * isn't listed. Entries run from source, bundled with core, so what's listed
 * is what each one exports at runtime.
 */
async function listNuxtEntries(packageDir) {
  const manifest = JSON.parse(readFileSync(path.join(packageDir, "package.json"), "utf8"))
  const subpaths = Object.entries(manifest.exports)
    .filter(([subpath, target]) => subpath !== "." && target.startsWith("./src/"))
    .map(([subpath]) => subpath)
  const modules = await loadEntries(packageDir, manifest, subpaths)
  const homes = homeEntries(modules)
  const globals = browserGlobals()
  return [...modules].flatMap(([subpath, exports]) => {
    const names = Object.keys(exports).filter((name) => homes.get(name) === subpath)
    const components = names.filter((name) => isComponent(exports[name]))
    const imports = names.filter((name) => !isComponent(exports[name]) && !globals.has(name))
    if (!components.length && !imports.length) return []
    return [{ from: `${manifest.name}/${subpath.slice(2)}`, components, imports }]
  })
}

async function loadEntries(packageDir, manifest, subpaths) {
  // Inside node_modules, so the bundles find the frameworks they leave outside.
  const cache = path.join(packageDir, "node_modules/.cache")
  mkdirSync(cache, { recursive: true })
  const out = mkdtempSync(path.join(cache, "nuxt-entries-"))
  try {
    await build({
      entryPoints: Object.fromEntries(
        subpaths.map((subpath) => [subpath.slice(2), path.join(packageDir, manifest.exports[subpath])]),
      ),
      outdir: out,
      outExtension: { ".js": ".mjs" },
      bundle: true,
      splitting: true,
      format: "esm",
      platform: "node",
      external: Object.keys(manifest.peerDependencies).filter((name) => !name.startsWith("@ui-sdk/")),
      logLevel: "warning",
    })
    const modules = new Map()
    for (const subpath of subpaths)
      modules.set(subpath, await import(pathToFileURL(path.join(out, `${subpath.slice(2)}.mjs`)).href))
    return modules
  } finally {
    rmSync(out, { recursive: true, force: true })
  }
}

// A name several entries export is registered once, from the entry it's
// named for: `CalendarDay` from `calendar`, not `date-picker`, and
// `createInputController` from `input`, not `textarea`.
function homeEntries(modules) {
  const owners = new Map()
  for (const [subpath, exports] of modules)
    for (const name of Object.keys(exports)) owners.set(name, [...(owners.get(name) ?? []), subpath])
  const homes = new Map()
  for (const [name, subpaths] of owners) {
    const words = `-${kebabCase(name)}-`
    homes.set(name, subpaths.find((subpath) => words.includes(`-${subpath.slice(2)}-`)) ?? subpaths[0])
  }
  return homes
}

function kebabCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
}

function isComponent(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    (typeof value.setup === "function" || typeof value.render === "function")
  )
}

// An auto-import would shadow a browser global of the same name in every
// file that calls it, so `confirm("Sure?")` would open a ui-sdk dialog.
function browserGlobals() {
  const dom = readFileSync(createRequire(import.meta.url).resolve("typescript/lib/lib.dom.d.ts"), "utf8")
  return new Set([...dom.matchAll(/^declare (?:function|var) (\w+)/gm)].map(([, name]) => name))
}

export { buildNuxtModule, listNuxtEntries }
