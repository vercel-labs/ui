// An unkeyed each reuses an item's component for another value, so its text
// follows what it renders now.
import { flushSync, mount, unmount } from "svelte"
import { expect, test } from "vitest"
import App from "./apps/select-item-text-app.svelte"

test("an item's text follows its content when the item is reused", async () => {
  const target = document.body.appendChild(document.createElement("div"))
  const props = $state({ items: ["apple", "banana", "cherry"] })
  const app = mount(App, { target, props })
  flushSync()
  await new Promise((done) => setTimeout(done))
  props.items = ["banana", "cherry"]
  flushSync()
  await new Promise((done) => setTimeout(done))
  const options = [...document.querySelectorAll('[role="option"]')]
  expect(options.map((option) => option.textContent?.trim())).toEqual([
    "BANANA",
    "CHERRY",
  ])
  expect(
    options.map((option) =>
      option.querySelector("[data-slot='item-text'], span")?.textContent?.trim()
    )
  ).toEqual(["BANANA", "CHERRY"])
  unmount(app)
  target.remove()
})
