import { flushSync, mount, unmount } from "svelte"
import { expect, test } from "vitest"
import App from "./apps/portaled-nested-click-app.svelte"

test("a click inside a button part reaches a portaled popup's own handler", async () => {
  const target = document.body.appendChild(document.createElement("div"))
  const entries: string[] = []
  const app = mount(App, {
    target,
    props: { log: (entry) => entries.push(entry) },
  })
  flushSync()
  await new Promise((done) => setTimeout(done))
  const label = [...document.querySelectorAll("span")].find(
    (el) => el.textContent === "Save"
  )!
  expect(target.contains(label)).toBe(false)
  label.click()
  expect(entries).toEqual(["button:click", "content:click"])
  unmount(app)
  target.remove()
})
