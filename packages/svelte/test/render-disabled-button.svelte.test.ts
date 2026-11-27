import { flushSync, mount, tick, unmount } from "svelte"
import { expect, test } from "vitest"
import App from "./apps/render-disabled-button-app.svelte"

test("a disabled part rendered as a Button through render disables the button", async () => {
  const target = document.body.appendChild(document.createElement("div"))
  const app = mount(App, { target })
  flushSync()
  await tick()
  const buttons = [...target.querySelectorAll("button")]
  expect(buttons.map((button) => button.textContent)).toEqual([
    "Open",
    "Choose files",
  ])
  for (const button of buttons) {
    expect(button.disabled).toBe(true)
  }
  unmount(app)
  target.remove()
})
