// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineFieldElements } from "../src/field"
import { defineSliderElements } from "../src/slider"

const wait = () => new Promise((resolve) => setTimeout(resolve, 20))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineFieldElements()
  defineSliderElements()
})

test("a press on a field's native label inside a range slider focuses the first thumb", async () => {
  document.body.innerHTML = `
    <ui-field>
      <ui-slider default-value="9/17" max="24">
        <ui-field-label as-child><label id="label">Quiet hours</label></ui-field-label>
        <ui-slider-control><ui-slider-track>
          <ui-slider-thumb aria-label="From"></ui-slider-thumb>
          <ui-slider-thumb aria-label="Until"></ui-slider-thumb>
        </ui-slider-track></ui-slider-control>
      </ui-slider>
    </ui-field>`
  await wait()
  const label = document.getElementById("label") as HTMLLabelElement
  label.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true, detail: 1 })
  )
  await wait()
  const first = document.querySelector('[aria-label="From"]')!
  expect(first.contains(document.activeElement)).toBe(true)
})
