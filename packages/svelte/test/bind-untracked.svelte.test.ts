import { flushSync, mount, unmount } from "svelte"
import { expect, test } from "vitest"
import App from "./apps/bind-untracked-app.svelte"

test("a part binds once while app state its bind read through an option changes", () => {
  const target = document.body.appendChild(document.createElement("div"))
  const log = { binds: 0, unbinds: 0 }
  const app = mount(App, { target, props: { log } })
  flushSync()
  for (let i = 0; i < 3; i++) {
    app.change()
    flushSync()
  }
  expect(log).toEqual({ binds: 1, unbinds: 0 })
  unmount(app)
  target.remove()
})
