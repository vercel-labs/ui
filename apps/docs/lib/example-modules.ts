import { readFileSync, statSync } from "node:fs"
import path from "node:path"
import { frameworks, type Framework } from "./frameworks"

type Manifest = Record<string, { file: string; imports?: string[] }>

// Vite's manifest of the compiled examples in public/examples, by framework.
// The dev server rebuilds them while it runs, so a newer manifest is read again.
// Turbopack skips tracing the path, as in repo-root.
const manifests = new Map<string, { changed: number; manifest: Manifest }>()

function manifestFor(example: string) {
  const file = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "public/examples",
    example,
    ".vite/manifest.json",
  )
  const changed = statSync(file, { throwIfNoEntry: false })?.mtimeMs
  if (changed === undefined) return null
  const cached = manifests.get(example)
  if (cached?.changed === changed) return cached.manifest
  const manifest: Manifest = JSON.parse(readFileSync(file, "utf8"))
  manifests.set(example, { changed, manifest })
  return manifest
}

/**
 * Every file an example imports before it runs, with its framework's
 * `mount.js`, as URLs, so the page can fetch them all at once instead of one
 * import at a time.
 */
function exampleModules(name: string, framework: Framework) {
  const { example, ext } = frameworks[framework]
  const manifest = manifestFor(example)
  if (!manifest) return []

  const [component, base] = name.split("/")
  const files = new Set<string>()
  const visit = (key: string) => {
    const chunk = manifest[key]
    if (!chunk || files.has(chunk.file)) return
    files.add(chunk.file)
    chunk.imports?.forEach(visit)
  }
  visit(`${component}/${example}/${base}.${ext}`)
  visit(`mount/${example}.ts`)
  return [...files].map((file) => `/examples/${example}/${file}`)
}

export { exampleModules }
