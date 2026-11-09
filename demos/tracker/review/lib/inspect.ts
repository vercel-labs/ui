import type { Root } from "./files"
import type { Framework } from "./frameworks"

type Frame = { file: string; line: number; label: string }

type Inspection = { frames: Frame[]; part: string | null; library: Frame[] }

type SvelteLocation = { file: string; line: number }
type SvelteStack = SvelteLocation & {
  type: string
  componentTag?: string
  parent?: SvelteStack
}
type SvelteElement = Element & {
  __svelte_meta?: { loc: SvelteLocation; parent?: SvelteStack }
}
type VueInstance = {
  type: { name?: string; __name?: string; __file?: string }
  parent: VueInstance | null
  __reviewLoc?: string
}
type VueElement = Element & { __vueParentComponent?: VueInstance }

function toTreePath(path: string, roots: Root[]) {
  for (const root of roots) {
    const index = path.indexOf(`/${root.dir}/`)
    if (index !== -1) {
      return `${root.name}/${path.slice(index + root.dir.length + 2)}`
    }
  }
  return path.startsWith("/") || path.startsWith(".") ? null : `app/${path}`
}

function svelteFrames(element: Element, roots: Root[]) {
  let node: SvelteElement | null = element
  while (node && !node.__svelte_meta) {
    node = node.parentElement
  }
  if (!node?.__svelte_meta) {
    return []
  }
  const frames: (Frame | null)[] = []
  const { loc, parent } = node.__svelte_meta
  const at = (location: SvelteLocation, label: string) => {
    const file = toTreePath(location.file, roots)
    return file ? { file, line: location.line, label } : null
  }
  frames.push(at(loc, `<${node.tagName.toLowerCase()}>`))
  for (let entry = parent; entry; entry = entry.parent) {
    if (entry.type === "component") {
      frames.push(at(entry, `<${entry.componentTag ?? "component"}>`))
    }
  }
  return untilAppCode(frames.filter((frame) => frame !== null))
}

// Keeps the frames from the element out to the first app component that isn't
// part of the app's own ui layer: where a feature uses the component.
function untilAppCode(frames: Frame[]) {
  const end = frames.findIndex(
    (frame, index) =>
      index > 0 &&
      frame.file.startsWith("app/") &&
      !frame.file.includes("/components/ui/")
  )
  return end === -1 ? frames : frames.slice(0, end + 1)
}

function vueFrames(element: Element, roots: Root[]) {
  const frames: Frame[] = []
  const at = (location: string | null | undefined, label: string) => {
    const match = location?.match(/^(.*):(\d+)$/)
    if (match) {
      frames.push({ file: `app/${match[1]}`, line: Number(match[2]), label })
    }
  }
  if (element.hasAttribute("data-review-loc")) {
    at(
      element.getAttribute("data-review-loc"),
      `<${element.tagName.toLowerCase()}>`
    )
  }
  let node: VueElement | null = element
  while (node && !node.__vueParentComponent) {
    node = node.parentElement
  }
  for (
    let instance = node?.__vueParentComponent ?? null;
    instance;
    instance = instance.parent
  ) {
    const name = instance.type.name ?? instance.type.__name ?? "component"
    at(instance.__reviewLoc, `<${name}>`)
  }
  if (frames.length === 0) {
    at(
      element.closest("[data-review-loc]")?.getAttribute("data-review-loc"),
      "inside"
    )
  }
  return untilAppCode(frames)
}

function attributeFrames(element: Element) {
  const frames: Frame[] = []
  const seen = new Set<string>()
  for (let node: Element | null = element; node; node = node.parentElement) {
    const location = node.getAttribute("data-review-loc")
    const match = location?.match(/^(.*):(\d+)$/)
    if (!location || !match || seen.has(location)) {
      continue
    }
    seen.add(location)
    frames.push({
      file: `app/${match[1]}`,
      line: Number(match[2]),
      label: `<${node.tagName.toLowerCase()}>`,
    })
  }
  return untilAppCode(frames)
}

function libraryFrames(part: string, framework: Framework, files: Set<string>) {
  const names = part.split("-")
  for (let length = names.length; length > 0; length--) {
    const component = names.slice(0, length).join("-")
    const core = `core/components/${component}/${component}.ts`
    if (!files.has(core)) {
      continue
    }
    const adapter = [
      `adapter/${component}/${part}.svelte`,
      `adapter/${component}/${component}.svelte`,
      `adapter/${component}.ts`,
      `adapter/${component}.tsx`,
    ].find((file) => files.has(file))
    return [
      ...(adapter
        ? [{ file: adapter, line: 1, label: `@ui-sdk/${framework}` }]
        : []),
      { file: core, line: 1, label: "@ui-sdk/core" },
    ]
  }
  return []
}

function inspect(
  element: Element,
  framework: Framework,
  roots: Root[],
  files: Set<string>
): Inspection {
  const frames =
    framework === "svelte"
      ? svelteFrames(element, roots)
      : framework === "vue"
        ? vueFrames(element, roots)
        : attributeFrames(element)
  const part = element.closest("[data-slot]")?.getAttribute("data-slot") ?? null
  return {
    frames,
    part,
    library: part ? libraryFrames(part, framework, files) : [],
  }
}

export { inspect }
export type { Frame, Inspection }
