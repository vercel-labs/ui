import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import type { Framework } from "./frameworks"

const repo = path.resolve(/* turbopackIgnore: true */ process.cwd(), "../../..")

const skipped = new Set([
  "node_modules",
  ".next",
  ".nuxt",
  ".output",
  ".svelte-kit",
  "dist",
  ".vercel",
])

type Root = { name: string; label: string; dir: string }

function rootsFor(framework: Framework): Root[] {
  return [
    { name: "app", label: "tracker", dir: `demos/tracker/${framework}` },
    { name: "data", label: "data", dir: "demos/tracker/data" },
    {
      name: "adapter",
      label: `@ui-sdk/${framework}`,
      dir: `packages/${framework}/src`,
    },
    { name: "core", label: "@ui-sdk/core", dir: "packages/core/src" },
  ]
}

async function walk(dir: string, prefix: string): Promise<string[]> {
  const entries = await readdir(path.join(repo, dir), { withFileTypes: true })
  const nested = await Promise.all(
    entries
      .filter(
        (entry) => !skipped.has(entry.name) && !entry.name.startsWith(".")
      )
      .map((entry) =>
        entry.isDirectory()
          ? walk(path.join(dir, entry.name), `${prefix}/${entry.name}`)
          : [`${prefix}/${entry.name}`]
      )
  )
  return nested.flat()
}

async function listFiles(framework: Framework) {
  const roots = rootsFor(framework)
  const files = await Promise.all(
    roots.map((root) => walk(root.dir, root.name))
  )
  return { roots, files: files.flat() }
}

function resolveFile(framework: Framework, file: string) {
  const [name, ...rest] = file.split("/")
  const root = rootsFor(framework).find((candidate) => candidate.name === name)
  if (!root || rest.length === 0) {
    return null
  }
  const base = path.join(repo, root.dir)
  const full = path.resolve(base, rest.join("/"))
  if (!full.startsWith(base + path.sep)) {
    return null
  }
  const segments = path.relative(base, full).split(path.sep)
  if (
    segments.some((segment) => skipped.has(segment) || segment.startsWith("."))
  ) {
    return null
  }
  return { full, repoPath: path.relative(repo, full) }
}

async function readSource(framework: Framework, file: string) {
  const resolved = resolveFile(framework, file)
  if (!resolved) {
    return null
  }
  try {
    return { ...resolved, code: await readFile(resolved.full, "utf8") }
  } catch {
    return null
  }
}

export { listFiles, readSource, rootsFor }
export type { Root }
