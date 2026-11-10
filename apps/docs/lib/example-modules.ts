import { readFile } from "node:fs/promises"
import path from "node:path"
import { cache } from "react"
import { frameworks, type Framework } from "./frameworks"

type Manifest = Record<
  string,
  { file: string; name?: string; isEntry?: boolean; imports?: string[] }
>

const readBuilt = cache(async (folder: string, name: string) => {
  const file = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "public/examples",
    folder,
    name
  )
  return JSON.parse(await readFile(file, "utf8").catch(() => "{}"))
})

const examplesOnPage = cache(() => ({ count: 0 }))

// Counted when an example starts rendering, which is in page order.
function exampleIndex() {
  return examplesOnPage().count++
}

async function readExampleModules(name: string, framework: Framework) {
  const folder = frameworks[framework].example
  const [manifest, prerendered, styles, stylesheets]: [
    Manifest,
    Record<string, string>,
    Record<string, string[]>,
    Manifest,
  ] = await Promise.all([
    readBuilt(folder, "manifest.json"),
    readBuilt(folder, "prerender.json"),
    readBuilt(folder, "styles.json"),
    readBuilt("styles", "manifest.json"),
  ])
  const entries = Object.entries(manifest)
  const find = (entry: string) =>
    entries.find(([, chunk]) => chunk.isEntry && chunk.name === entry)?.[0]
  const example = find(name)
  const mount = find("mount")
  if (!example || !mount) {
    return null
  }

  const files = new Set<string>()
  const add = (key: string) => {
    const chunk = manifest[key]
    if (!chunk || files.has(chunk.file)) {
      return
    }
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
    styles: styles[name].map(
      (source) => `/examples/styles/${stylesheets[source].file}`
    ),
    html: prerendered[name],
  }
}

export { exampleIndex, readExampleModules }
