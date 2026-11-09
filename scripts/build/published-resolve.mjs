// A Node resolve hook that finds the workspace's `@ui-sdk/*` packages, and
// their `#` imports, the way they resolve once published: through
// `publishConfig`, so a check runs the built `dist` files, not `src`.
import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const packagesDir = path.resolve(import.meta.dirname, "../../packages")
const manifests = new Map(
  readdirSync(packagesDir).flatMap((dir) => {
    try {
      const manifest = JSON.parse(
        readFileSync(path.join(packagesDir, dir, "package.json"), "utf8")
      )
      return [[manifest.name, { dir: path.join(packagesDir, dir), manifest }]]
    } catch {
      return []
    }
  })
)

// The file a published map's target names, taking `default` at each level.
const fileOf = (target) =>
  typeof target === "string" ? target : fileOf(target.default)

async function resolve(specifier, context, next) {
  const named = /^(@ui-sdk\/[^/]+)(\/.+)?$/.exec(specifier)
  if (named && manifests.has(named[1])) {
    const { dir, manifest } = manifests.get(named[1])
    const target = manifest.publishConfig.exports[`.${named[2] ?? ""}`]
    if (target) {
      return {
        url: pathToFileURL(path.join(dir, fileOf(target))).href,
        shortCircuit: true,
      }
    }
  }
  if (specifier.startsWith("#") && context.parentURL?.startsWith("file:")) {
    const parent = fileURLToPath(context.parentURL)
    for (const { dir, manifest } of manifests.values()) {
      const target =
        parent.startsWith(dir + path.sep) &&
        manifest.publishConfig?.imports?.[specifier]
      if (target) {
        return {
          url: pathToFileURL(path.join(dir, fileOf(target))).href,
          shortCircuit: true,
        }
      }
    }
  }
  return next(specifier, context)
}

export { resolve }
