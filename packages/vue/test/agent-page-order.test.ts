// @vitest-environment jsdom
// An agent reads items and buttons in the page's order, whatever order the parts bound in.
import { afterEach, expect, test } from "vitest"
import { createApp, h, nextTick, ref, type App } from "vue"
import { createAgent } from "../src/agent"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "../src/collapsible"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuTrigger,
} from "../src/menu"
import { Tabs, TabsList, TabsPanel, TabsTab } from "../src/tabs"

Element.prototype.getAnimations ??= () => []
HTMLElement.prototype.showPopover ??= function () {}
HTMLElement.prototype.hidePopover ??= function () {}

let app: App | undefined

afterEach(() => {
  app?.unmount()
  app = undefined
  document.body.replaceChildren()
})

const mount = (render: () => ReturnType<typeof h>) => {
  app = createApp({ render })
  app.mount(document.body.appendChild(document.createElement("div")))
}

const entry = (component: string) =>
  createAgent()
    .snapshot()
    .find((item) => item.component === component)!

test("tabs list replaced tabs in their order on the page", async () => {
  const keys = ref(["one", "two", "three"])
  mount(() =>
    h(Tabs, { defaultValue: "one" }, () => [
      h(TabsList, { "aria-label": "Sections" }, () =>
        keys.value.map((key) =>
          h(TabsTab, { key, value: key }, () => key.toUpperCase())
        )
      ),
      ...keys.value.map((key) =>
        h(TabsPanel, { key, value: key }, () => `${key} panel`)
      ),
    ])
  )
  await nextTick()
  keys.value = ["red", "green", "blue"]
  await nextTick()
  expect(entry("tabs").items?.map((item) => item.value)).toEqual([
    "red",
    "green",
    "blue",
  ])
})

test("an open menu lists its buttons in their order on the page", async () => {
  mount(() =>
    h(Menu, { defaultOpen: true }, () => [
      h(MenuTrigger, null, () => "Actions"),
      h(MenuContent, null, () => [
        h(MenuItem, { value: "first" }, () => "First"),
        h(MenuGroup, null, () => [
          h(MenuGroupLabel, null, () => "Group"),
          h(MenuItem, { value: "grouped" }, () => "Grouped"),
        ]),
        h(MenuItem, { value: "last" }, () => "Last"),
      ]),
    ])
  )
  await nextTick()
  expect(entry("menu").buttons).toEqual(["First", "Grouped", "Last"])
})

test("an open collapsible lists its trigger before its panel's buttons", async () => {
  mount(() =>
    h(Collapsible, { defaultOpen: true }, () => [
      h(CollapsibleTrigger, null, () => "Details"),
      h(CollapsiblePanel, null, () =>
        h("button", { type: "button" }, "Inside")
      ),
    ])
  )
  await nextTick()
  expect(entry("collapsible").buttons).toEqual(["Details", "Inside"])
})
