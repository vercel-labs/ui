// @vitest-environment jsdom
// Letting go of an element removes what a channel wrote on it, and leaves it
// with what its author gave it, even values the channel wrote too.
import { expect, test } from "vitest"
import { applyAttrs, markAuthored, releaseAttrs } from "../src/foundation/kernel/live"

const element = (html: string) => {
  document.body.innerHTML = html
  return document.body.firstElementChild as HTMLElement
}

test("letting go of an element removes what was written on it", () => {
  const el = element(`<div></div>`)
  applyAttrs(el, { role: "checkbox", "aria-disabled": "true" })
  releaseAttrs(el, "render")
  expect(el.getAttributeNames()).toEqual([])
})

test("letting go of an element keeps what its author wrote with the same value", () => {
  const el = element(`<div disabled="" role="checkbox" aria-disabled="true"></div>`)
  applyAttrs(el, { disabled: "", role: "checkbox", "aria-disabled": "true", tabindex: "0" })
  releaseAttrs(el, "render")
  expect(el.outerHTML).toBe(`<div disabled="" role="checkbox" aria-disabled="true"></div>`)
})

test("letting go of an element puts back what its author wrote that was written over", () => {
  const el = element(`<div disabled="disabled" role="button"></div>`)
  applyAttrs(el, { disabled: "", role: "checkbox" })
  applyAttrs(el, { disabled: "", role: "checkbox", "aria-checked": "true" })
  releaseAttrs(el, "render")
  expect(el.outerHTML).toBe(`<div disabled="disabled" role="button"></div>`)
})

test("an attribute its author writes again with the written value stays when the element is let go of", () => {
  const el = element(`<div></div>`)
  applyAttrs(el, { disabled: "" })
  el.setAttribute("disabled", "")
  markAuthored(el, "disabled")
  releaseAttrs(el, "render")
  expect(el.getAttribute("disabled")).toBe("")
})

test("letting go of an element another channel wrote the same attribute on keeps that channel's", () => {
  const el = element(`<div></div>`)
  applyAttrs(el, { "data-open": "" }, "a")
  applyAttrs(el, { "data-open": "" }, "b")
  releaseAttrs(el, "b")
  expect(el.hasAttribute("data-open")).toBe(true)
})

test("letting go of a copied element doesn't give back the ids the original's parts made", () => {
  const el = element(`<div id="ui-sdk-tabs-1-tab-a" aria-controls="ui-sdk-tabs-1-panel-a"></div>`)
  applyAttrs(el, { id: "ui-sdk-tabs-2-tab-a", "aria-controls": "ui-sdk-tabs-2-panel-a" })
  releaseAttrs(el, "render")
  expect(el.getAttributeNames()).toEqual([])
})
