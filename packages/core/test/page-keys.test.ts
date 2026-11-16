// @vitest-environment jsdom
// PageUp and PageDown move a list's highlight a page, and stop at its ends
// even where the arrows wrap, as the APG asks.
import { afterEach, expect, test } from "vitest"
import { combobox } from "../src/components/combobox/combobox"
import { mount } from "../src/testing"

const mounts: { unmount: () => void }[] = []
afterEach(() => {
  mounts.splice(0).forEach((mounted) => mounted.unmount())
  document.body.replaceChildren()
})

const letters = [..."abcdefghijkl"]

test("a combobox's page keys stop at the ends, and its arrows still wrap", async () => {
  const view = mount(
    combobox,
    { items: letters },
    `<root><label>Letter</label><input><content><list></list></content></root>`
  )
  mounts.push(view)
  ;(view.part("input") as HTMLElement).focus()
  await view.keys("ArrowUp")
  expect(view.state.highlighted).toBe("l")
  await view.keys("PageDown")
  expect(view.state.highlighted).toBe("l")
  await view.keys("PageUp", "PageUp")
  expect(view.state.highlighted).toBe("a")
  await view.keys("ArrowUp")
  expect(view.state.highlighted).toBe("l")
})
