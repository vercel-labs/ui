// @vitest-environment jsdom
// Every option and slot prop follows a change after the first render, in
// React's own components, as in packages/core/test/after-mount.test.ts.
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, test } from "vitest"
import { schemaOf } from "../../core/src/foundation/kernel/primitive"
import type { Primitive } from "../../core/src/foundation/kernel/primitive-types"
import { parseMarkup, type MarkupNode } from "../../core/src/testing/markup"
import { slotProps } from "../../core/src/testing/schema"
import {
  baseOptions,
  changesOf,
  idle,
  pageOf,
  tabStopProblem,
  title,
  withAttribute,
} from "../../core/test/after-mount"
import { cases, type Case } from "../../core/test/after-mount.cases"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
Element.prototype.getAnimations ??= () => []

// Every part React ships, by its export name.
const components = new Map<string, React.ComponentType<Record<string, unknown>>>()
for (const module of Object.values(import.meta.glob("../src/*.tsx", { eager: true })))
  for (const [name, value] of Object.entries(module as Record<string, unknown>))
    if (typeof value === "function" && /^[A-Z]/.test(name))
      components.set(name, value as React.ComponentType<Record<string, unknown>>)

const pascal = (name: string) => name.replace(/(^|[-\s])(\w)/g, (_, __, char: string) => char.toUpperCase())

// Parts React names its own way, and those it renders itself, inside or around
// the parts a person writes, whose markup children stay.
const named: Record<string, string> = {
  "Radio:group": "RadioGroup",
  "Radio:root": "Radio",
  "Tree:label": "TreeItemLabel",
  "Toast:root": "ToastRegion",
}
const rendered = new Set([
  "Checkbox:input",
  "Checkbox:group-input",
  "Combobox:form-input",
  "DatePicker:hidden-input",
  "Drawer:viewport",
  "FileInput:input",
  "NumberInput:hidden-input",
  "OTPInput:control",
  "Select:form-input",
  "Slider:thumb-input",
  "Toast:list",
  "TokenInput:form-input",
])
const reactIds = /«[^»]*»|:r[0-9a-z]+:|_r_[0-9a-z]+_|mount-\d+/g

// React spells a few attributes its own way.
const reactName: Record<string, string> = { class: "className", for: "htmlFor", tabindex: "tabIndex" }

function tree(entry: Case, markup: string, options: Record<string, unknown>) {
  const primitive = entry.primitive as Primitive
  const schema = schemaOf(primitive)
  const name = pascal(primitive.name ?? "").replace(/^Otp/, "OTP")
  const part = (slot: string) => {
    // A date picker's calendar parts are Calendar's.
    const component =
      components.get(named[`${name}:${slot}`] ?? (slot === "root" ? name : name + pascal(slot))) ??
      components.get(`Calendar${pascal(slot)}`)
    if (!component) throw new Error(`React has no part for ${name} ${slot}.`)
    return component
  }
  const isSlot = (node: MarkupNode | string): node is MarkupNode =>
    typeof node !== "string" && (node.tag === "root" || node.tag in schema.slots)
  // The outermost part takes the options, as it holds the instance; markup with none gets a root around it.
  function build(node: MarkupNode | string, key: number, outermost = false): React.ReactNode {
    if (typeof node === "string") return node
    const children = node.children.map((child, index) => build(child, index))
    if (!isSlot(node)) {
      const props = Object.fromEntries(
        node.attributes.map(([attribute, value]) => [reactName[attribute] ?? attribute, value]),
      )
      return React.createElement(node.tag, { ...props, key }, ...children)
    }
    if (rendered.has(`${name}:${node.tag}`)) return React.createElement(React.Fragment, { key }, ...children)
    const { props, extra } = slotProps(schema.slots[node.tag] ?? {}, node.attributes, {}, () => "")
    for (const prop in props) if (props[prop] === undefined || props[prop] === "") delete props[prop]
    for (const [attribute, value] of extra)
      if (attribute !== "as") props[reactName[attribute] ?? attribute] = value
    if (outermost) Object.assign(props, options)
    return React.createElement(part(node.tag), { ...props, key }, ...children)
  }
  const nodes = parseMarkup(markup)
  const owned = nodes.some(isSlot)
  const built = nodes.map((node, index) => build(node, index, owned))
  return owned ? built : React.createElement(part("root"), options, ...built)
}

let root: Root | undefined
let container: HTMLElement | undefined

async function render(entry: Case, markup: string, options: Record<string, unknown>) {
  container ??= document.body.appendChild(document.createElement("div"))
  root ??= createRoot(container)
  await React.act(async () => root!.render(tree(entry, markup, options)))
  await React.act(idle)
  return container
}

async function unmount() {
  await React.act(async () => root?.unmount())
  root = undefined
  container = undefined
  document.body.replaceChildren()
}

afterEach(unmount)

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
        const expected = pageOf(fresh, entry.history, reactIds)
        const freshProblem = tabStopProblem({ root: fresh })
        await unmount()

        const changed = await render(entry, markupAt(change.from), optionsAt(change.from))
        await render(entry, markupAt(change.to), optionsAt(change.to))
        expect(pageOf(changed, entry.history, reactIds)).toEqual(expected)
        if (entry.history?.includes("stop") && !freshProblem)
          expect(tabStopProblem({ root: changed })).toBeUndefined()
      })
  })
