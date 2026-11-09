import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"

// Paths only the repo resolves. Fixtures and the docs build reach core's
// modules through `./internal/*`, and publishing it would make every file in
// `dist` public API.
const workspaceOnly = new Set(["./internal/*"])

/**
 * Checks the manifest `pnpm pack` publishes against the build. In the repo,
 * `exports` and `imports` point at `src`, so apps, docs and tests run from
 * source with no build step. `publishConfig` swaps in the `dist` maps when
 * packing. This lists where the two drift apart and published paths with no
 * file behind them.
 */
function findPublishProblems(packageDir) {
  const manifest = JSON.parse(
    readFileSync(path.join(packageDir, "package.json"), "utf8")
  )
  return [
    ...(manifest.files?.includes("dist")
      ? []
      : ['"files" must include "dist".']),
    ...findMapProblems(packageDir, manifest, "exports"),
    ...findMapProblems(packageDir, manifest, "imports"),
  ]
}

function findMapProblems(packageDir, manifest, field) {
  const sourceMap = manifest[field] ?? {}
  const publishedMap = manifest.publishConfig?.[field] ?? {}
  const problems = []
  for (const key of Object.keys(sourceMap)) {
    if (workspaceOnly.has(key)) {
      if (key in publishedMap) {
        problems.push(
          `publishConfig.${field}["${key}"] is for the workspace only, so it must not be published.`
        )
      }
    } else if (!(key in publishedMap)) {
      problems.push(
        `publishConfig.${field} has no "${key}". Map each ./src/<file>.ts to ./dist/<file>.js, with "types" first.`
      )
    }
  }
  for (const [key, target] of Object.entries(publishedMap)) {
    // TypeScript takes the first matching condition, so `types` must come first.
    if (
      typeof target === "object" &&
      "types" in target &&
      Object.keys(target)[0] !== "types"
    ) {
      problems.push(`publishConfig.${field}["${key}"] must list "types" first.`)
    }
    for (const file of publishedFiles(packageDir, target, sourceMap[key])) {
      if (!existsSync(path.join(packageDir, file))) {
        problems.push(
          `publishConfig.${field}["${key}"] points at ${file}, which the build didn't emit.`
        )
      }
    }
  }
  return problems
}

/**
 * The files a published target names. A `*` pattern is expanded with every
 * source file its repo counterpart matches, so `./*` checks one built file
 * per source module. A published pattern with no repo counterpart, like a
 * new `./*.css`, has nothing to expand and isn't checked.
 */
function publishedFiles(packageDir, target, sourceTarget) {
  const files = stringLeaves(target)
  if (!files.some((file) => file.includes("*"))) {
    return files
  }
  const names = stringLeaves(sourceTarget ?? {}).flatMap((pattern) =>
    wildcardMatches(packageDir, pattern)
  )
  return files.flatMap((file) => names.map((name) => file.replace("*", name)))
}

function stringLeaves(target) {
  return typeof target === "string"
    ? [target]
    : Object.values(target).flatMap(stringLeaves)
}

// What `*` stands for in each file under the package that `pattern` matches.
function wildcardMatches(packageDir, pattern) {
  const [prefix, suffix] = pattern.split("*")
  if (suffix === undefined) {
    return []
  }
  const searchDir = path.join(
    packageDir,
    prefix.slice(0, prefix.lastIndexOf("/"))
  )
  return readdirSync(searchDir, { recursive: true })
    .map((file) => `./${path.relative(packageDir, path.join(searchDir, file))}`)
    .filter((file) => file.startsWith(prefix) && file.endsWith(suffix))
    .map((file) => file.slice(prefix.length, file.length - suffix.length))
}

export { findPublishProblems }
