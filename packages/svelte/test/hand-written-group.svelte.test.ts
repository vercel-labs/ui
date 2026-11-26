import { flushSync, mount, unmount } from "svelte"
import { expect, test } from "vitest"
import App from "./apps/hand-written-group-app.svelte"

test("a part written with usePart gives its props to the parts inside it that take them from it", () => {
  const target = document.body.appendChild(document.createElement("div"))
  const app = mount(App, { target })
  flushSync()
  expect(
    [...target.querySelectorAll("[data-group]")].map((item) =>
      item.getAttribute("data-group")
    )
  ).toEqual(["generated", "by hand"])
  unmount(app)
  target.remove()
})
