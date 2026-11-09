import {
  partElement,
  partElements,
  type createParts as createPartsType,
  type definePart as definePartType,
} from "../../../packages/web/src/define-element"

/** One element a web entry defines, as its define call described it. */
type Definition = {
  kind: "owner" | "part" | "element"
  entry: string
  tagName: string
  // Its key in `createParts`' tags, or its slot in `definePart`.
  key?: string
  // What the manifest reads from a define call's config.
  config: {
    attributes?: Record<string, unknown>
    props?: Record<string, unknown>
    state?: Record<string, unknown>
    properties?: string[]
    defaults?: Record<string, boolean | ((el: HTMLElement) => boolean)>
    api?: string[]
    silent?: string[]
    events?: Record<string, string>
    owner?: string
    slot?: string
    target?: unknown
    formAssociated?: boolean
  }
  // The define call's place in the bundle, which the source map points back to the source.
  stack: string
}

const definitions: Definition[] = []
let entry = ""

/** Credits the definitions that follow to `name`, like `tabs`. */
function begin(name: string) {
  entry = name
}

const record = (
  kind: Definition["kind"],
  tagName: string,
  config: Definition["config"] = {},
  key?: string
) => {
  definitions.push({
    kind,
    entry,
    tagName,
    key,
    config,
    stack: new Error().stack ?? "",
  })
}

// The elements `createParts` and `definePart` describe from the primitive's
// schema, each recorded at the call, which the manifest finds by key.
function createParts(...[primitive, tags]: Parameters<typeof createPartsType>) {
  for (const element of partElements(primitive, tags)) {
    record(element.kind, element.tagName, element.config, element.key)
  }
}

function definePart(
  ...[primitive, slot, tagOrOptions]: Parameters<typeof definePartType>
) {
  const element = partElement(primitive, slot, tagOrOptions)
  record(element.kind, element.tagName, element.config, element.key)
}

// Elements defined by hand, like <ui-calendar-weeks>, claim their tag first.
// Declining it skips the rest of their definition.
function claimTag(tagName: string) {
  record("element", tagName)
  return false
}

function setDisplay() {}

export {
  begin,
  claimTag,
  createParts,
  definePart,
  type Definition,
  definitions,
  setDisplay,
}
export * from "../../../packages/web/src/define-element"
