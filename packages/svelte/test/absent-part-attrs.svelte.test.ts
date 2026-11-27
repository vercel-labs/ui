import { flushSync, mount, unmount } from "svelte"
import { afterEach, expect, test } from "vitest"
import App from "./apps/absent-part-attrs-app.svelte"

afterEach(() => document.body.replaceChildren())

test("part.attrs still updates when read while the part is not present", () => {
  const app = mount(App, { target: document.body })
  flushSync()
  const output = () => document.querySelector("output")!.textContent
  expect(output()).toBe("a")

  app.api.setFlag("b")
  flushSync()
  expect(output()).toBe("b")
  unmount(app)
})
