// @vitest-environment jsdom
// Of two components' parts on one element, the inner one names it, as the
// element passed to `render` does in the other frameworks.
import { expect, test } from "vitest"
import { defineNumberInputElements } from "../src/number-input"
import { defineToolbarElements } from "../src/toolbar"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

test("a number input's control inside a toolbar input keeps its data-slot when either renders again", async () => {
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineToolbarElements()
  defineNumberInputElements()
  document.body.innerHTML = `
    <ui-toolbar aria-label="Text">
      <ui-number-input default-value="14">
        <ui-toolbar-input>
          <ui-number-input-control><input aria-label="Font size" /></ui-number-input-control>
        </ui-toolbar-input>
        <ui-number-input-increment><button aria-label="Increase font size">+</button></ui-number-input-increment>
      </ui-number-input>
      <ui-toolbar-input><input aria-label="Find" /></ui-toolbar-input>
    </ui-toolbar>`
  await wait()
  const [fontSize, find] = document.querySelectorAll("input")
  expect(fontSize.getAttribute("data-slot")).toBe("number-input-control")
  expect(find.getAttribute("data-slot")).toBe("toolbar-input")

  document.querySelector<HTMLButtonElement>('[aria-label="Increase font size"]')!.click()
  await wait()
  expect(fontSize.value).toBe("15")
  expect(fontSize.getAttribute("data-slot")).toBe("number-input-control")

  document.querySelector("ui-toolbar")!.setAttribute("orientation", "vertical")
  await wait()
  expect(fontSize.getAttribute("data-orientation")).toBe("vertical")
  expect(fontSize.getAttribute("data-slot")).toBe("number-input-control")
})
