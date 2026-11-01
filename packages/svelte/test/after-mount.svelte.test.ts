// Every option and slot prop follows a change after the first render, in
// Svelte's own components, as in packages/core/test/after-mount.test.ts.
import { flushSync, mount, tick, unmount } from "svelte"
import { afterEach, describe, expect, test } from "vitest"
import {
  baseOptions,
  type Built,
  changesOf,
  idle,
  pageOf,
  partsOf,
  tabStopProblem,
  title,
  withAttribute,
} from "../../core/test/after-mount"
import { cases, type Case } from "../../core/test/after-mount.cases"
import * as exported from "../src"
import Tree, { isPart, type Part } from "./apps/after-mount-tree.svelte"

const components = new Map<string, Part>()
for (const [name, value] of Object.entries(exported)) if (isPart(name, value)) components.set(name, value)

const svelteIds = /mount-\d+|\bc\d+\b/g

// Changes that run a change callback as the options land, so its state is
// written inside Svelte's effect, which the setup fails on as a relay.
const callbacks: Record<string, string[]> = {
  'combobox > value: "Apple" to "Banana"': ["query"],
  'combobox > value: "Banana" to "Apple"': ["query"],
  'command > query: "" to "a"': ["highlighted", "value"],
  'command > query: "a" to ""': ["highlighted", "value"],
}

function relayedKeys() {
  const history = (globalThis as Record<symbol, { relays?: { keys: string[] }[] } | undefined>)[
    Symbol.for("ui-sdk.devtools.history@1")
  ]
  return [...new Set(history?.relays?.splice(0).flatMap((relay) => relay.keys))].sort()
}

let app: ReturnType<typeof mount> | undefined
let container: HTMLElement | undefined
let shown: { nodes: Built[]; components: typeof components } | undefined

async function render(entry: Case, markup: string, options: Record<string, unknown>) {
  const nodes = partsOf(entry, markup, options, (name) => components.has(name))
  if (!app) {
    container = document.body.appendChild(document.createElement("div"))
    const props = $state({ nodes, components })
    shown = props
    app = mount(Tree, { target: container, props })
  } else shown!.nodes = nodes
  flushSync()
  await tick()
  await idle()
  flushSync()
  await idle()
  return document.body
}

function release() {
  if (app) unmount(app)
  app = undefined
  container = undefined
  document.body.replaceChildren()
}

afterEach(release)

for (const entry of cases)
  describe(entry.name, () => {
    const { changes } = changesOf(entry)
    for (const change of changes)
      test.skipIf(title(change) in (entry.skip ?? {}))(title(change), async () => {
        const base = baseOptions(entry, change)
        const markupAt = (value: unknown) =>
          change.kind === "prop" ? withAttribute(entry.markup, change, value) : entry.markup
        const optionsAt = (value: unknown) =>
          change.kind === "option" ? { ...base, [change.key]: value } : base

        const fresh = await render(entry, markupAt(change.to), optionsAt(change.to))
        const expected = pageOf(container!, entry.history, svelteIds)
        const freshProblem = tabStopProblem({ root: fresh })
        release()

        const changed = await render(entry, markupAt(change.from), optionsAt(change.from))
        await render(entry, markupAt(change.to), optionsAt(change.to))
        expect(pageOf(container!, entry.history, svelteIds)).toEqual(expected)
        if (entry.history?.includes("stop") && !freshProblem)
          expect(tabStopProblem({ root: changed })).toBeUndefined()
        const known = callbacks[`${entry.name} > ${title(change)}`]
        if (known) expect(relayedKeys()).toEqual(known)
      })
  })
