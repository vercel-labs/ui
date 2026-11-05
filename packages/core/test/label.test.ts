// @vitest-environment jsdom
import { expect, test } from "vitest"
import { label } from "../src/components/label/label"
import { attrs, bind } from "../src/foundation/kernel/part"

test("a label renders an id, which a control it names points at", () => {
  expect(attrs(label({ id: "l" }).part("root"))).toEqual({ "data-slot": "label-root", id: "l" })
})

test("a native label around a group names it, and leaves a native control to the browser", async () => {
  document.body.innerHTML = `<label id="plan">Plan <div role="radiogroup"></div></label>
    <label id="terms">Terms <input type="checkbox"></label>`
  const [plan, terms] = Array.from(document.querySelectorAll("label"))
  const unbind = [
    bind(label({ id: "plan" }).part("root"), plan),
    bind(label({ id: "terms" }).part("root"), terms),
  ]
  await Promise.resolve()
  expect(plan.querySelector("[role=radiogroup]")!.getAttribute("aria-labelledby")).toBe("plan")
  expect(terms.querySelector("input")!.hasAttribute("aria-labelledby")).toBe(false)
  unbind.forEach((each) => each())
})
