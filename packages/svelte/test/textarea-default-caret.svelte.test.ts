import { flushSync, mount, unmount } from "svelte"
import { expect, test } from "vitest"
import App from "./apps/textarea-default-caret-app.svelte"

test("a textarea's default value leaves the caret at its start", () => {
  const target = document.body.appendChild(document.createElement("div"))
  const app = mount(App, { target })
  flushSync()
  const textarea = target.querySelector("textarea")!
  expect(textarea.value).toBe("one\ntwo\nthree")
  expect(textarea.selectionStart).toBe(0)
  unmount(app)
  target.remove()
})
