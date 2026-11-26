// @vitest-environment jsdom
// With the input in the popup, the button that opens it stays in the tab order.
import { expect, test } from "vitest"
import { createApp, h, nextTick } from "vue"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "../src/combobox"

async function mount(inPopup: boolean) {
  const root = document.createElement("div")
  document.body.replaceChildren(root)
  const input = () => h(ComboboxInput, { "aria-label": "Search countries" })
  createApp({
    render: () =>
      h(Combobox, { defaultValue: "jp", open: true }, () => [
        h(ComboboxTrigger, { "aria-label": "Country" }, () => h(ComboboxValue)),
        !inPopup && input(),
        h(ComboboxContent, null, () => [
          inPopup && input(),
          h(ComboboxList, null, () => [
            h(ComboboxItem, { value: "jp", label: "Japan" }, () => "Japan"),
          ]),
        ]),
      ]),
  }).mount(root)
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve))
  return document.querySelector('[data-slot="combobox-trigger"]')!
}

test("a trigger opening a popup that holds the input keeps its tab stop", async () => {
  expect((await mount(true)).hasAttribute("tabindex")).toBe(false)
})

test("a trigger beside the input leaves the tab order", async () => {
  expect((await mount(false)).getAttribute("tabindex")).toBe("-1")
})
