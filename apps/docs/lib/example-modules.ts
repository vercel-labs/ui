import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { frameworks, type Framework } from "./frameworks"

type Manifest = Record<string, { file: string; imports?: string[] }>

// Vite's manifest of the compiled examples in public/examples, read once per
// framework. Turbopack skips tracing the path, as in repo-root.
const manifests = new Map<string, Manifest | null>()

function manifestFor(example: string) {
  if (!manifests.has(example)) {
    const file = path.join(
      /* turbopackIgnore: true */ process.cwd(),
      "public/examples",
      example,
      ".vite/manifest.json",
    )
    manifests.set(example, existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null)
  }
  return manifests.get(example)
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
