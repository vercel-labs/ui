import "@ui-sdk/web/dialog"
import "@ui-sdk/web/alert-dialog"
import * as classes from "./classes"
import { kitchenSink } from "./shell"
import { flakyAction, type Variant } from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

function body(variant: Variant) {
  if (variant.body === "text") {
    return ""
  }
  if (variant.body === "long") {
    return Array.from(
      { length: 40 },
      (_, index) => `<p>Line ${index + 1}</p>`
    ).join("")
  }
  if (variant.body === "dialog-form") {
    return `<form method="dialog" class="mb-4 flex gap-2">
      <button class="${classes.button}" value="draft">Save draft</button>
      <button class="${classes.button}" value="publish">Publish</button>
    </form>`
  }
  if (variant.body === "nested") {
    return `
      <ui-dialog>
        <ui-dialog-trigger><button class="${classes.trigger} mb-4">Advanced</button></ui-dialog-trigger>
        <ui-dialog-backdrop class="${classes.backdrop()}"></ui-dialog-backdrop>
        <ui-dialog-content class="${classes.content()}">
          <ui-dialog-title class="${classes.title}">Advanced settings</ui-dialog-title>
          <ui-dialog-close><button class="${classes.button}">Done</button></ui-dialog-close>
        </ui-dialog-content>
      </ui-dialog>`
  }
  return `<label class="mb-4 flex flex-col gap-1">Name<input class="${classes.input}" value="Ada" /></label>`
}

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    const tag = variant.alert ? "ui-alert-dialog" : "ui-dialog"
    const dialog = document.createElement(tag) as HTMLElement & {
      controller?: unknown
      api?: { open: () => void; close: () => void }
    }
    for (const [option, value] of Object.entries(variant.options ?? {})) {
      dialog.setAttribute(
        kebab(option),
        Array.isArray(value) ? value.join(",") : String(value)
      )
    }
    if (env.container) {
      dialog.setAttribute("container", `#${env.container.id}`)
    }
    const contentAttributes = Object.entries(variant.content ?? {})
      .map(([name, value]) => `${kebab(name)}="${value}"`)
      .join(" ")
    const backdrop = variant.backdrop ?? "part"
    dialog.innerHTML = `
      <${tag}-trigger ${variant.shortcut ? `shortcut="${variant.shortcut}"` : ""}><button class="${classes.trigger}">${variant.trigger ?? "Open"}${
        variant.shortcut
          ? ` <${tag}-shortcut class="text-xs text-neutral-500"></${tag}-shortcut>`
          : ""
      }</button></${tag}-trigger>
      ${backdrop === "part" ? `<${tag}-backdrop class="${classes.backdrop(variant.animation)}"></${tag}-backdrop>` : ""}
      <${tag}-content class="${classes.content(variant.animation, backdrop === "pseudo")}" ${contentAttributes}>
        ${variant.titled !== false ? `<${tag}-title class="${classes.title}">${variant.title}</${tag}-title>` : ""}
        <${tag}-description class="${classes.description}">${variant.note ?? "A dialog."}</${tag}-description>
        ${variant.alert ? "" : body(variant)}
        <div class="flex justify-end gap-2">
          ${variant.alert ? "" : `<button class="${classes.button}" data-save>Save</button>`}
          <${tag}-close><button class="${classes.button}">${variant.alert ? "Cancel" : "Close"}</button></${tag}-close>
          ${variant.alert ? `<${tag}-close value="confirm" ${variant.action ? "action" : ""}><button class="${classes.danger}">Delete</button></${tag}-close>` : ""}
        </div>
      </${tag}-content>
    `
    const wrapper = Object.assign(document.createElement("div"), {
      className: "flex items-center gap-3",
    })
    wrapper.append(dialog)
    slot.append(wrapper)
    dialog
      .querySelector("[data-save]")
      ?.addEventListener("click", () => env.log("save"))
    // A changed form refuses dismissals and asks. The Close part always closes.
    dialog.querySelector("input")?.addEventListener("input", () => {
      if (variant.guard) {
        dialog.setAttribute("dismissible", "false")
      }
    })
    dialog.addEventListener("dismissattempt", (event) => {
      if (event.target !== dialog) {
        return
      }
      env.log(
        `dismissAttempt (${(event as CustomEvent<{ reason: string }>).detail.reason})`
      )
      if (variant.guard && window.confirm("Discard changes?")) {
        dialog.api?.close()
      }
    })
    // An action event: waitUntil() keeps the dialog open and the button pending.
    const action = dialog.querySelector(`${tag}-close[action]`)
    action?.addEventListener("action", (event) => {
      const button = action.querySelector("button")!
      button.textContent = "Deleting…"
      const run = flakyAction()
      ;(
        event as CustomEvent<{ waitUntil: (promise: Promise<unknown>) => void }>
      ).detail.waitUntil(run)
      run.catch(() => (button.textContent = "Retry"))
    })

    // Callbacks are DOM events on the element. Nested dialogs bubble theirs too.
    dialog.addEventListener("openchange", (event) => {
      if (event.target !== dialog) {
        return
      }
      const { value, reason, returnValue } = (
        event as CustomEvent<{
          value: boolean
          reason: string
          returnValue?: string
        }>
      ).detail
      if (!value && variant.guard) {
        dialog.removeAttribute("dismissible")
      }
      env.log(
        `openChange ${value} (${reason})${returnValue ? ` returnValue=${returnValue}` : ""}`
      )
      if (variant.controlled) {
        checkbox.checked = value
      }
    })
    dialog.addEventListener("openchangecomplete", (event) => {
      if (event.target === dialog) {
        env.log(
          `openChangeComplete ${(event as CustomEvent<{ value: boolean }>).detail.value}`
        )
      }
    })
    dialog.controller = env.controller

    // Web components have no controlled prop. The checkbox drives the element's api instead.
    const checkbox = Object.assign(document.createElement("input"), {
      type: "checkbox",
    })
    if (variant.controlled) {
      const label = Object.assign(document.createElement("label"), {
        className: "flex items-center gap-1.5 text-xs text-neutral-600",
      })
      label.append(checkbox, "open")
      wrapper.append(label)
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          dialog.api?.open()
        } else {
          dialog.api?.close()
        }
      })
    }
  })
}

export { mount }
