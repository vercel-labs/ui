// A popup moved out of the app's root, like into the body where there's no
// top layer, still runs the handlers on its own element and those inside it.
import { flushSync, mount, unmount } from "svelte"
import { expect, test } from "vitest"
import App from "./apps/portaled-part-handlers-app.svelte"

test("a portaled part's own handlers run after the ones inside it", async () => {
  const target = document.body.appendChild(document.createElement("div"))
  const entries: string[] = []
  const app = mount(App, {
    target,
    props: { log: (entry) => entries.push(entry) },
  })
  flushSync()
  await new Promise((done) => setTimeout(done))
  const button = [...document.querySelectorAll("button")].find(
    (el) => el.textContent === "Inside"
  )!
  expect(target.contains(button)).toBe(false)
  button.dispatchEvent(
    new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true })
  )
  button.click()
  expect(entries).toEqual([
    "button:keydown",
    "content:keydown",
    "content:click",
  ])
  unmount(app)
  target.remove()
})
