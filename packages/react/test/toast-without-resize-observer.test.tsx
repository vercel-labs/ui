// @vitest-environment jsdom
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import { Toast, ToastRegion, ToastTitle, createToaster } from "../src/toast"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
Element.prototype.getAnimations ??= () => []
HTMLElement.prototype.showPopover ??= function () {}
HTMLElement.prototype.hidePopover ??= function () {}

let root: Root | undefined

afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

test("a toast shows where ResizeObserver doesn't exist", async () => {
  expect(typeof ResizeObserver).toBe("undefined")
  const toaster = createToaster()
  const container = document.body.appendChild(document.createElement("div"))
  root = createRoot(container)
  await React.act(async () =>
    root!.render(
      <ToastRegion toaster={toaster}>
        {() => (
          <Toast>
            <ToastTitle />
          </Toast>
        )}
      </ToastRegion>
    )
  )
  await React.act(async () => {
    toaster("Saved")
  })
  expect(container.querySelector('[data-slot="toast"]')?.textContent).toBe(
    "Saved"
  )
})
