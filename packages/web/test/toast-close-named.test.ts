// @vitest-environment jsdom
// A close button with a name of its own, like an icon drawn by CSS, is the
// author's close, not the toast's cancel.
import { afterEach, expect, test } from "vitest"
import type { UiToastRegionElement } from "../src/events"
import { createToaster, defineToastElements } from "../src/toast"

// jsdom has no Web Animations API and no ResizeObserver, which a toast uses.
Element.prototype.getAnimations ??= () => []
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

afterEach(() => document.body.replaceChildren())

test("a close named by aria-label stays shown and empty, with or without a cancel", async () => {
  defineToastElements()
  document.body.innerHTML = `
    <ui-toast-region>
      <template>
        <ui-toast>
          <ui-toast-title></ui-toast-title>
          <ui-toast-close><button aria-label="Close notification"></button></ui-toast-close>
        </ui-toast>
      </template>
    </ui-toast-region>`
  const cancels: string[] = []
  const toaster = createToaster()
  const region = document.querySelector(
    "ui-toast-region"
  ) as UiToastRegionElement
  region.toaster = toaster
  toaster("Event created", { duration: Infinity })
  toaster("Message archived", {
    duration: Infinity,
    cancel: { label: "Dismiss", onCancel: () => cancels.push("Dismiss") },
  })
  await wait()
  const closes = [...region.querySelectorAll("ol ui-toast")].map((el) => {
    const close = el.querySelector<HTMLElement>("ui-toast-close")!
    return [
      el.querySelector("ui-toast-title")!.textContent,
      close.hidden,
      close.textContent,
    ]
  })
  expect(closes).toEqual([
    ["Message archived", false, ""],
    ["Event created", false, ""],
  ])
  region.querySelector<HTMLElement>("ol ui-toast-close button")!.click()
  expect(cancels).toEqual([])
})
