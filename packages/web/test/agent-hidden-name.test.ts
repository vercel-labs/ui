// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { createAgent } from "../src/agent"
import { defineResizableElements } from "../src/resizable"
import { defineTabsElements } from "../src/tabs"

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  defineTabsElements()
  defineResizableElements()
})

test("a component replaced while its tab is hidden takes back its ref, with no nameless copy", async () => {
  const agent = createAgent()
  const editor = `
    <ui-resizable default-layout="35,65">
      <ui-resizable-panel>Files</ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize files"></ui-resizable-handle>
      <ui-resizable-panel>Editor</ui-resizable-panel>
    </ui-resizable>`
  document.body.innerHTML = `
    <ui-tabs default-value="code">
      <ui-tabs-list aria-label="Views">
        <ui-tabs-tab value="code"><button>Code</button></ui-tabs-tab>
        <ui-tabs-tab value="notes"><button>Notes</button></ui-tabs-tab>
      </ui-tabs-list>
      <ui-tabs-panel value="code"><div id="editor">${editor}</div></ui-tabs-panel>
      <ui-tabs-panel value="notes"><p>No notes yet.</p></ui-tabs-panel>
    </ui-tabs>`
  const tabs = document.querySelector("ui-tabs") as HTMLElement & {
    value: string
  }
  const resizables = () =>
    agent.snapshot().filter(({ component }) => component === "resizable")
  await wait()
  const [{ ref, label }] = resizables()
  expect(label).toBe("Resize files")
  tabs.value = "notes"
  await wait()
  resizables()
  document.querySelector("#editor")!.innerHTML = editor
  tabs.value = "code"
  await wait()
  expect(
    resizables().map((entry) => [entry.ref, entry.label, !!entry.offPage])
  ).toEqual([[ref, "Resize files", false]])
})
