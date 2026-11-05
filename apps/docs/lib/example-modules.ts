import { readFile } from "node:fs/promises"
import path from "node:path"
import { cache } from "react"
import { frameworks, type Framework } from "./frameworks"

type Manifest = Record<string, { file: string; name?: string; isEntry?: boolean; imports?: string[] }>

const readManifest = cache(async (folder: string) => {
  const file = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "public/examples",
    folder,
    "manifest.json",
  )
  return JSON.parse(await readFile(file, "utf8").catch(() => "{}")) as Manifest
})

async function readExampleModules(name: string, framework: Framework) {
  const folder = frameworks[framework].example
  const manifest = await readManifest(folder)
  const entries = Object.entries(manifest)
  const find = (entry: string) => entries.find(([, chunk]) => chunk.isEntry && chunk.name === entry)?.[0]
  const example = find(name)
  const mount = find("mount")
  if (!example || !mount) return null

  const files = new Set<string>()
  const add = (key: string) => {
    const chunk = manifest[key]
    if (!chunk || files.has(chunk.file)) return
    files.add(chunk.file)
    chunk.imports?.forEach(add)
  }
  add(example)
  add(mount)
  const url = (file: string) => `/examples/${folder}/${file}`
  return {
    src: url(manifest[example].file),
    mount: url(manifest[mount].file),
    preload: [...files].map(url),
  }
}

export { readExampleModules }
