// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest"
import { dialog } from "../src/components/dialog/dialog"
import { mount } from "../src/testing"

const markup = `<div>
  <trigger>Share</trigger>
  <backdrop></backdrop>
  <content><title>Share</title><close>Close</close></content>
</div>`

afterEach(() => {
  vi.restoreAllMocks()
})

// Gives each element an exit that ends when its returned function runs, or
// none at all for `null`.
function exits(parts: [Element, "animates" | null][]) {
  const computed = window.getComputedStyle
  const fading = {
    transitionDuration: "10s",
    transitionDelay: "0s",
    animationDuration: "0s",
    animationDelay: "0s",
  }
  vi.spyOn(window, "getComputedStyle").mockImplementation((el, pseudo) =>
    parts.some(([part]) => part === el)
      ? (fading as CSSStyleDeclaration)
      : computed(el, pseudo)
  )
  return parts.map(([el, kind]) => {
    let end = () => {}
    const finished = new Promise<void>((resolve) => (end = resolve))
    Object.assign(el, {
      getAnimations: () => (kind ? [{ finished, effect: null }] : []),
    })
    return end
  })
}

const frames = () => new Promise((resolve) => setTimeout(resolve, 50))

test("content whose exit ends first keeps its ending style until the backdrop's ends", async () => {
  const view = mount(dialog, { modal: true }, markup)
  await view.click(view.part("trigger")!)
  const [backdrop, content] = [view.part("backdrop")!, view.part("content")!]
  const [endBackdrop, endContent] = exits([
    [backdrop, "animates"],
    [content, "animates"],
  ])
  await view.keys("Escape")
  endContent()
  await frames()
  expect(view.state.mounted).toBe(true)
  expect(content.hasAttribute("data-ending-style")).toBe(true)
  endBackdrop()
  await frames()
  expect(view.state.mounted).toBe(false)
  view.unmount()
})

test("content with no exit keeps its ending style while the backdrop's plays", async () => {
  const view = mount(dialog, { modal: true }, markup)
  await view.click(view.part("trigger")!)
  const [backdrop, content] = [view.part("backdrop")!, view.part("content")!]
  const [endBackdrop] = exits([
    [backdrop, "animates"],
    [content, null],
  ])
  await view.keys("Escape")
  await frames()
  expect(content.hasAttribute("data-ending-style")).toBe(true)
  endBackdrop()
  await frames()
  expect(view.state.mounted).toBe(false)
  view.unmount()
})
