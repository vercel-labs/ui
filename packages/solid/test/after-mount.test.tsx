// Every option and slot prop follows a change after the first render, in
// Solid's own components, as in packages/core/test/after-mount.test.ts.
import { createComponent, Dynamic, render } from "@solidjs/web"
import { createSignal, flush, type JSX } from "solid-js"
import { afterEach, describe, expect, test } from "vitest"
import {
  baseOptions,
  type Built,
  callbackRelays,
  changesOf,
  idle,
  markupOf,
  partsOf,
  relayedKeys,
  tabStopProblem,
  title,
  withAttribute,
} from "../../core/test/after-mount"
import { cases, type Case } from "../../core/test/after-mount.cases"
import * as exported from "../src"

// jsdom lays nothing out, so an anchor would never render and a placed popup
// would never move again. Every element in the page renders, at no size.
Element.prototype.getClientRects = function () {
  return (this.isConnected ? [this.getBoundingClientRect()] : []) as never
}

const components = new Map<string, (props: object) => JSX.Element>()
for (const [name, value] of Object.entries(exported))
  if (typeof value === "function" && /^[A-Z]/.test(name)) components.set(name, value as never)

const solidIds = /mount-\d+|\bcl-\d+\b/g

type Node = Exclude<Built, string>

const nodeAt = (tree: Built[], path: number[]) =>
  path.slice(1).reduce((node, index) => (node as Node).children[index], tree[path[0]!] as Built)

// Each node renders once, with props that read the tree shown now, so a new
// value reaches the same component rather than a new one.
function view(shown: () => Built[], trees: Built[][], path: number[]): JSX.Element {
  const first = nodeAt(trees[0]!, path)
  if (typeof first === "string") return () => nodeAt(shown(), path) as string
  const node = () => nodeAt(shown(), path) as Node
  const keys = new Set(trees.flatMap((tree) => Object.keys((nodeAt(tree, path) as Node).props)))
  const props: Record<string, unknown> = first.part ? {} : { component: first.tag }
  for (const key of keys)
    Object.defineProperty(props, key, { enumerable: true, get: () => node().props[key] })
  const content = () => first.children.map((_, index) => view(shown, trees, [...path, index]))
  if (first.children.length) Object.defineProperty(props, "children", { enumerable: true, get: content })
  if (first.part) return createComponent(components.get(first.part)!, props)
  if (first.tag) return createComponent(Dynamic as never, props)
  return content()
}

let dispose: (() => void) | undefined
let container: HTMLElement | undefined
let setShown: ((tree: Built[]) => void) | undefined

// Renders the first tree, then each next one in its place.
async function show(trees: Built[][]) {
  const [shown, set] = createSignal(trees[0]!)
  setShown = set
  container = document.body.appendChild(document.createElement("div"))
  dispose = render(() => trees[0]!.map((_, index) => view(shown, trees, [index])), container)
  await settle()
  for (const tree of trees.slice(1)) {
    setShown!(tree)
    await settle()
  }
}

async function settle() {
  flush()
  await idle()
  flush()
  await idle()
}

// The page as the case renders it: its own markup, then what it portaled to
// the body, like a popup, in an order moves don't change. Announcers are shared.
function pageOf(entry: Case) {
  const portaled = [...document.body.children].filter(
    (el) => el !== container && !el.hasAttribute("data-ui-sdk-announcer"),
  )
  const markup = (el: Element) => markupOf(el as HTMLElement, entry.history, solidIds)
  return [markup(container!), ...portaled.map(markup).sort()].join("\n")
}

function release() {
  dispose?.()
  dispose = undefined
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

        const tree = (value: unknown) =>
          partsOf(entry, markupAt(value), optionsAt(value), (name) => components.has(name))
        await show([tree(change.to)])
        const expected = pageOf(entry)
        const freshProblem = tabStopProblem({ root: document.body })
        release()

        await show([tree(change.from), tree(change.to)])
        expect(pageOf(entry)).toEqual(expected)
        if (entry.history?.includes("stop") && !freshProblem)
          expect(tabStopProblem({ root: document.body })).toBeUndefined()
        expect(relayedKeys()).toEqual(callbackRelays[`${entry.name} > ${title(change)}`] ?? [])
      })
  })
