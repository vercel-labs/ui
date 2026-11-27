// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest"
import { bindIndicator } from "../src/foundation/selection/indicator"

const wait = () => new Promise((resolve) => setTimeout(resolve))

afterEach(() => {
  document.documentElement.removeAttribute("dir")
  document.body.replaceChildren()
})

test("an indicator binds to a list still in a template, and follows a new dir once it's in the page", async () => {
  const template = document.createElement("template")
  template.innerHTML = `<div role="tablist"><button data-item>A</button></div>`
  const list = template.content.firstElementChild as HTMLElement
  const active = list.querySelector("button")
  let writes = 0
  const stop = bindIndicator({
    list: () => list,
    active: () => active,
    itemSelector: "[data-item]",
    subscribe: () => () => {},
    write: () => {
      writes++
    },
    followHover: () => false,
  })
  document.body.append(list)
  await wait()
  const before = writes
  document.documentElement.dir = "rtl"
  await wait()
  expect(writes).toBeGreaterThan(before)
  stop()
})
