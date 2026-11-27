// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineFieldElements } from "../src/field"
import { defineInputElements } from "../src/input"

const wait = () => new Promise((resolve) => setTimeout(resolve, 20))

beforeAll(() => {
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineFieldElements()
  defineInputElements()
})

test("a nested field that keeps its element's own slot keeps its control", async () => {
  document.body.innerHTML = `
    <ui-field id="outer">
      <ui-field-label id="outer-label">Redirect URL</ui-field-label>
      <div>
        <ui-field as-child><div id="addon" data-slot="input-group-addon">
          <ui-field-label id="inner-label">Protocol</ui-field-label>
          <ui-input><input id="protocol" required /></ui-input>
        </div></ui-field>
        <ui-input><input id="url" /></ui-input>
      </div>
    </ui-field>`
  const addon = document.getElementById("addon")!
  new MutationObserver(() => {
    if (addon.getAttribute("data-slot") !== "input-group-addon") {
      addon.setAttribute("data-slot", "input-group-addon")
    }
  }).observe(addon, { attributeFilter: ["data-slot"] })
  addon.setAttribute("data-slot", "input-group-addon")
  await wait()
  expect(addon.getAttribute("data-slot")).toBe("input-group-addon")
  const protocol = document.getElementById("protocol")!
  const url = document.getElementById("url")!
  expect(protocol.getAttribute("aria-labelledby") ?? "").not.toContain(
    "outer-label"
  )
  expect(document.getElementById("outer-label")!.getAttribute("for")).toBe(
    url.id
  )
  expect(document.getElementById("inner-label")!.getAttribute("for")).toBe(
    protocol.id
  )
  expect(document.getElementById("outer")!.hasAttribute("data-required")).toBe(
    false
  )
})
