// @vitest-environment jsdom
import { bindDragPreview } from "@ui-sdk/core"
import { afterEach, beforeAll, expect, test } from "vitest"
import { defineButtonElements } from "../src/button"
import { defineCheckboxElements } from "../src/checkbox"
import { defineMenuElements } from "../src/menu"

const wait = () => new Promise((resolve) => setTimeout(resolve, 20))

beforeAll(() => {
  Element.prototype.getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineButtonElements()
  defineCheckboxElements()
  defineMenuElements()
})

afterEach(() => document.body.replaceChildren())

test("a drag copy's elements keep the state and attributes they were copied with", async () => {
  document.body.innerHTML = `
    <div id="task">
      <ui-checkbox aria-label="Done"></ui-checkbox>
      <ui-menu>
        <ui-menu-trigger><ui-button><button aria-label="Actions">...</button></ui-button></ui-menu-trigger>
        <ui-menu-content><ui-menu-item value="delete">Delete</ui-menu-item></ui-menu-content>
      </ui-menu>
    </div>`
  await wait()
  const task = document.querySelector<HTMLElement>("#task")!
  task.querySelector<HTMLElement>("ui-checkbox")!.click()
  await wait()
  const preview = bindDragPreview(task, { x: 0, y: 0 })
  const copied = preview.el.innerHTML
  const box = preview.el.querySelector("ui-checkbox")!
  expect(box.getAttribute("aria-checked")).toBe("true")
  await wait()
  await wait()
  expect(box.getAttribute("aria-checked")).toBe("true")
  expect(preview.el.innerHTML).toBe(copied)
  preview.remove()
})
