// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineTreeElements } from "../src/tree"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

const row = (value: string) =>
  `<ui-tree-item value="${value}"><ui-tree-item-label>${value}</ui-tree-item-label></ui-tree-item>`

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  defineTreeElements()
})

test("rows written again as new elements under their values keep their places", async () => {
  document.body.innerHTML = `
    <ui-tree aria-label="Files" default-expanded="env">
      <ui-tree-item value="env"><ui-tree-item-label>env</ui-tree-item-label>
        <ui-tree-group>${row("a")}${row("b")}</ui-tree-group>
      </ui-tree-item>
    </ui-tree>`
  await wait()
  const group = document.querySelector("ui-tree-group")!
  group.innerHTML = row("new") + row("a") + row("b")
  await wait()
  const positions = [...group.querySelectorAll("ui-tree-item")].map(
    (item) =>
      `${item.getAttribute("aria-posinset")}/${item.getAttribute("aria-setsize")}`
  )
  expect(positions).toEqual(["1/3", "2/3", "3/3"])
})
