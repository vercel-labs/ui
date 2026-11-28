import { globSync, readFileSync } from "node:fs"
import { flushSync, mount, unmount, type Component } from "svelte"
import { parse } from "svelte/compiler"
import { afterEach, expect, test } from "vitest"
import { Checkbox, CheckboxGroup } from "../src/checkbox"
import { Listbox } from "../src/listbox"
import { NumberInput } from "../src/number-input"
import { Switch } from "../src/switch"

type TemplateNode = {
  type: string
  name?: string
  data?: string
  start: number
  [key: string]: unknown
}
type Fragment = { nodes: TemplateNode[] }

afterEach(() => document.body.replaceChildren())

const rendered = (
  component: Component<any>,
  props: Record<string, unknown>
) => {
  const app = mount(component, { target: document.body, props })
  flushSync()
  const nodes = [...document.body.childNodes]
    .filter((node) => node.nodeType !== Node.COMMENT_NODE)
    .filter((node) => node.nodeType !== Node.TEXT_NODE || node.textContent)
    .map((node) =>
      node.nodeType === Node.TEXT_NODE
        ? JSON.stringify(node.textContent)
        : node.nodeName
    )
  unmount(app)
  return nodes
}

const formElement = (node: TemplateNode): boolean =>
  (node.type === "RegularElement" &&
    (node.name === "input" || node.name === "textarea")) ||
  (node.type === "Component" &&
    (node.name === "ValueInput" || node.name === "RatingRadio")) ||
  ((node.type === "IfBlock" || node.type === "EachBlock") &&
    ((node.consequent ?? node.body) as Fragment).nodes.some(formElement))

test("a control renders its hidden native input with no text beside it", () => {
  expect(rendered(Checkbox, { "aria-label": "Accept" })).toEqual([
    "BUTTON",
    "INPUT",
  ])
  expect(rendered(Switch, { "aria-label": "Wi-Fi" })).toEqual([
    "BUTTON",
    "INPUT",
  ])
  expect(rendered(CheckboxGroup, { "aria-label": "Toppings" })).toEqual([
    "DIV",
    "INPUT",
  ])
  expect(rendered(NumberInput, { "aria-label": "Amount" })).toEqual([
    "DIV",
    "INPUT",
  ])
  expect(
    rendered(Listbox, { "aria-label": "Fruit", name: "fruit", items: [] })
  ).toEqual(["DIV", "TEXTAREA"])
})

test("no component writes whitespace beside a hidden form element", () => {
  const found: string[] = []
  const walk = (
    fragment: Fragment | undefined,
    file: string,
    source: string
  ) => {
    if (!fragment?.nodes) return
    // Svelte drops comments, so the whitespace on both sides of one renders.
    const nodes = fragment.nodes
      .filter((node) => node.type !== "Comment")
      .filter(
        (node, index, all) =>
          node.type !== "Text" || all[index - 1]?.type !== "Text"
      )
    if (nodes.some(formElement)) {
      nodes.forEach((node, index) => {
        const around = [nodes[index - 1], nodes[index + 1]]
        if (
          node.type === "Text" &&
          !node.data!.trim() &&
          around.every(
            (near) =>
              near && near.type !== "Text" && near.type !== "SnippetBlock"
          )
        ) {
          found.push(
            `${file}:${source.slice(0, node.start).split("\n").length}`
          )
        }
      })
    }
    for (const node of fragment.nodes) {
      for (const key of ["fragment", "body", "consequent", "alternate"]) {
        walk(node[key] as Fragment | undefined, file, source)
      }
    }
  }
  const root = `${import.meta.dirname}/../`
  for (const file of globSync("src/**/*.svelte", { cwd: root })) {
    const source = readFileSync(root + file, "utf8")
    walk(
      parse(source, { modern: true }).fragment as unknown as Fragment,
      file,
      source
    )
  }
  expect(found).toEqual([])
})
