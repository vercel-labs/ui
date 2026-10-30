// @vitest-environment jsdom
// The agent names a component by its label, like React's does, though the
// web adapter keys every part by its element.
import { beforeAll, expect, test } from "vitest"
import { createAgent } from "../src/agent"
import { defineComboboxElements } from "../src/combobox"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  ;(Element.prototype as { getAnimations?: () => Animation[] }).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineComboboxElements()
})

test("a combobox is named by its label, not by its trigger", async () => {
  const agent = createAgent()
  document.body.innerHTML = `
    <ui-combobox>
      <ui-combobox-label>Assignee</ui-combobox-label>
      <ui-combobox-input><input placeholder="Nobody" /></ui-combobox-input>
      <ui-combobox-trigger><button aria-label="Show people">⌄</button></ui-combobox-trigger>
      <ui-combobox-content>
        <ui-combobox-list><ui-combobox-item value="ann">Ann</ui-combobox-item></ui-combobox-list>
      </ui-combobox-content>
    </ui-combobox>`
  await wait()
  expect(agent.snapshot()).toEqual([expect.objectContaining({ component: "combobox", label: "Assignee" })])
})
