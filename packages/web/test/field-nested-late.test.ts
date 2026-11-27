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

test("a field nested in another and added later keeps its own control", async () => {
  document.body.innerHTML = `
    <ui-field id="outer">
      <ui-field-label id="outer-label">Status emoji</ui-field-label>
      <button type="button">Pick</button>
      <ui-field-description id="outer-description">Shown next to your name.</ui-field-description>
      <div id="slot"></div>
    </ui-field>`
  await wait()
  document.getElementById("slot")!.innerHTML = `
    <ui-field id="inner">
      <ui-input><input id="search" type="search" aria-label="Search" /></ui-input>
    </ui-field>`
  await wait()
  const search = document.getElementById("search")!
  expect(search.getAttribute("aria-labelledby") ?? "").not.toContain(
    "outer-label"
  )
  expect(search.getAttribute("aria-describedby") ?? "").not.toContain(
    "outer-description"
  )
  expect(document.getElementById("outer-label")!.getAttribute("for")).not.toBe(
    "search"
  )
})
