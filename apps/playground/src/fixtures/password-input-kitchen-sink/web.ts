import { createPasswordInputController } from "@ui-sdk/core/password-input"
import type { UiPasswordInputElement } from "@ui-sdk/web"
import * as classes from "./classes"
import { kitchenSink } from "./shell"

const eye = `<svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>`

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/field")
  await import("@ui-sdk/web/password-input")
  kitchenSink(root, "web", (slot, variant, env) => {
    const { fieldDisabled, autoComplete, ...options } = (variant.options ??
      {}) as Record<string, unknown>
    const attributes = Object.entries(options)
      .map(([key, value]) =>
        value === true ? kebab(key) : `${kebab(key)}="${value}"`
      )
      .join(" ")
    const toggleTag = variant.render === "span" ? "span" : "button"
    const input = `
      <ui-password-input class="${classes.root}" ${attributes}>
        <input class="${classes.input}"${variant.field ? "" : ' aria-label="Password"'}${autoComplete ? ` autocomplete="${autoComplete}"` : ""}>
        <ui-password-input-toggle><${toggleTag} class="${classes.toggle}" aria-label="Show password">${eye}</${toggleTag}></ui-password-input-toggle>
      </ui-password-input>`
    slot.innerHTML = variant.field
      ? `<ui-field${fieldDisabled ? " disabled" : ""} class="flex flex-col gap-1.5">
          <ui-field-label class="${classes.label}">Password</ui-field-label>${input}
          <ui-field-description class="${classes.description}">At least 8 characters.</ui-field-description>
        </ui-field>`
      : variant.id === "caps-lock"
        ? `<div class="group flex flex-col gap-1">${input}<p class="${classes.capsLock}">Caps Lock is on</p></div>`
        : variant.form
          ? `<form class="flex flex-col items-start gap-2">${input}<div class="flex gap-2"><button class="${classes.button}">Submit</button><button type="reset" class="${classes.control}">Reset</button></div></form>`
          : input
    const element =
      slot.querySelector<UiPasswordInputElement>("ui-password-input")!
    element.addEventListener("valuechange", (event) =>
      env.log(`valueChange "${event.detail.value}" (${event.detail.reason})`)
    )
    element.addEventListener("visiblechange", (event) => {
      if (variant.cancel) {
        return event.preventDefault()
      }
      env.log(
        `visibleChange ${event.detail.value} (${event.detail.reason}, ${event.detail.source})`
      )
    })
    const form = slot.querySelector("form")
    form?.addEventListener("submit", (event) => {
      event.preventDefault()
      env.log(
        `submit password=${JSON.stringify(new FormData(form).get("password"))}`
      )
    })
    form?.addEventListener("reset", () => env.log("reset"))
    if (!variant.controller) {
      return
    }
    const controller = createPasswordInputController()
    element.controller = controller
    env.controls([
      ["toggleVisible()", () => controller.toggleVisible()],
      ["setVisible(true)", () => controller.setVisible(true)],
      ["isVisible()", () => controller.isVisible()],
      ['setValue("hunter22")', () => controller.setValue("hunter22")],
      ["getValue()", () => controller.getValue()],
      ["clear()", () => controller.clear()],
      ["focus()", () => controller.focus()],
    ])
  })
}

export { mount }
