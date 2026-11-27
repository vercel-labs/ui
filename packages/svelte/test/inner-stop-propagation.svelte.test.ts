// A handler on an element inside a part runs before the part's, so its
// `stopPropagation()` keeps the key or click from the part, as in React.
import { flushSync, mount, unmount } from "svelte"
import { expect, test } from "vitest"
import App from "./apps/inner-stop-propagation-app.svelte"

test("a field inside a tree row that stops its keys and clicks keeps them", async () => {
  const target = document.body.appendChild(document.createElement("div"))
  const app = mount(App, { target })
  flushSync()
  await new Promise((done) => setTimeout(done))
  const input = target.querySelector("input")!
  for (const key of ["ArrowDown", "End", "c"]) {
    input.focus()
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })
    )
    flushSync()
    expect(document.activeElement).toBe(input)
  }
  input.click()
  flushSync()
  expect(target.querySelector("output")!.textContent).toBe("a")
  unmount(app)
  target.remove()
})
