// @vitest-environment jsdom
import { createApp, h, nextTick, ref } from "vue"
import { expect, test } from "vitest"
import { Tabs, TabsList, TabsPanel, TabsTab } from "../src/tabs"

Element.prototype.getAnimations ??= () => []

test("a tab added and selected in one update reads the way the selection moved", async () => {
  const restore = Element.prototype.getBoundingClientRect
  Element.prototype.getBoundingClientRect = function () {
    const index = Array.prototype.indexOf.call(
      this.parentElement?.children ?? [],
      this
    )
    return new DOMRect(index * 80, 0, 80, 20)
  }
  const tabs = ref(["a", "b"])
  const value = ref<string | null>("a")
  const container = document.body.appendChild(document.createElement("div"))
  const app = createApp(() =>
    h(
      Tabs,
      {
        value: value.value,
        "onUpdate:value": (next: string | null) => (value.value = next),
      },
      () => [
        h(TabsList, { "aria-label": "Views" }, () =>
          tabs.value.map((tab) =>
            h(TabsTab, { key: tab, value: tab }, () => tab)
          )
        ),
        ...tabs.value.map((tab) =>
          h(TabsPanel, { key: tab, value: tab }, () => tab)
        ),
      ]
    )
  )
  app.mount(container)
  await nextTick()
  tabs.value.push("new")
  value.value = "new"
  await nextTick()
  await Promise.resolve()
  const tab = container.querySelector('[role="tab"][aria-selected="true"]')!
  expect(tab.textContent).toBe("new")
  expect(tab.getAttribute("data-activation-direction")).toBe("right")
  app.unmount()
  container.remove()
  Element.prototype.getBoundingClientRect = restore
})
