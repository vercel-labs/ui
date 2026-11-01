// Every option and slot prop follows a change after the first render, in
// Svelte's own components, as in packages/core/test/after-mount.test.ts.
import { flushSync, mount, tick, unmount, type Component } from "svelte"
import { afterEach, describe, expect, test } from "vitest"
import {
  baseOptions,
  type Built,
  changesOf,
  idle,
  markupOf,
  partsOf,
  tabStopProblem,
  title,
  withAttribute,
} from "../../core/test/after-mount"
import { cases, type Case } from "../../core/test/after-mount.cases"
import * as exported from "../src"
import Tree from "./apps/after-mount-tree.svelte"

// jsdom lays nothing out, so an anchor would never render and a placed popup
// would never move again. Every element in the page renders, at no size.
Element.prototype.getClientRects = function () {
  return (this.isConnected ? [this.getBoundingClientRect()] : []) as never
}

const components = new Map<string, Component<any>>()
for (const [name, value] of Object.entries(exported))
  if (typeof value === "function" && /^[A-Z]/.test(name)) components.set(name, value as never)

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

// The page as the case renders it: its own markup, then what it portaled to
// the body, like a popup, in an order moves don't change. Announcers are shared.
function pageOf(entry: Case) {
  const portaled = [...document.body.children].filter(
    (el) => el !== container && !el.hasAttribute("data-ui-sdk-announcer"),
  )
  const markup = (el: Element) => markupOf(el as HTMLElement, entry.history, svelteIds)
  return [markup(container!), ...portaled.map(markup).sort()].join("\n")
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
        const expected = pageOf(entry)
        const freshProblem = tabStopProblem({ root: fresh })
        release()

        const changed = await render(entry, markupAt(change.from), optionsAt(change.from))
        await render(entry, markupAt(change.to), optionsAt(change.to))
        expect(pageOf(entry)).toEqual(expected)
        if (entry.history?.includes("stop") && !freshProblem)
          expect(tabStopProblem({ root: changed })).toBeUndefined()
        const known = callbacks[`${entry.name} > ${title(change)}`]
        if (known) expect(relayedKeys()).toEqual(known)
      })
  })
