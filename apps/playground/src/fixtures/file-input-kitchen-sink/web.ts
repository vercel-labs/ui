import { createFileInputController } from "@ui-sdk/core/file-input"
import type { UiFileInputElement } from "@ui-sdk/web"
import { classes as c, renderShell } from "./shell"
import {
  announcementFor,
  describe,
  sampleFile,
  validateName,
  type Variant,
} from "./variants"

const attributes = (options: Record<string, unknown> = {}) =>
  Object.entries(options)
    .map(([key, value]) => {
      const name = key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
      if (value === true) {
        return ` ${name}`
      }
      return ` ${name}="${Array.isArray(value) ? value.join(",") : String(value)}"`
    })
    .join("")

function markup(variant: Variant) {
  const page = typeof variant.dropzone === "object"
  const trigger = variant.trigger
    ? `<ui-file-input-trigger><button class="${c.button}">Choose files</button></ui-file-input-trigger>`
    : ""
  const zone = `<ui-file-input-dropzone class="${page ? c.page : c.zone}"${page ? ` target="document"` : ""}${variant.pasteTarget ? ` paste-target="#${variant.id}-note"` : ""}>
      <span>${page ? "Drop files anywhere" : "Drop files here"}</span>
      ${trigger}
      ${variant.nested ? `<ui-file-input data-inner><ui-file-input-dropzone class="${c.zone}">Inner zone</ui-file-input-dropzone></ui-file-input>` : ""}
    </ui-file-input-dropzone>`
  const list = `<ui-file-input-list class="${c.list}" aria-label="Files">
      <template>
        <ui-file-input-item class="${c.item}">
          <span data-file="name"></span>
          <ui-file-input-item-remove><button type="button" class="${c.remove}">×</button></ui-file-input-item-remove>
        </ui-file-input-item>
      </template>
    </ui-file-input-list>`
  const input = `<ui-file-input class="${c.root}"${attributes(variant.props)}>${variant.dropzone ? zone : trigger}${variant.list ? list : ""}</ui-file-input>`
  return `
    <form class="${c.form}">
      ${page ? "<span>Drag files over the window.</span>" : ""}
      ${
        variant.field
          ? `<ui-field><ui-field-label>Files</ui-field-label>${input}<ui-field-description class="${c.description}">Required.</ui-field-description><ui-field-error class="${c.error}"></ui-field-error></ui-field>`
          : input
      }
      ${variant.pasteTarget ? `<textarea id="${variant.id}-note" class="${c.note}" aria-label="Paste here"></textarea>` : ""}
      ${variant.controller ? `<div class="flex gap-2"><button type="button" class="${c.button}" data-add>Add a sample file</button><button type="button" class="${c.button}" data-open>Open the picker</button><button type="button" class="${c.button}" data-clear>Clear</button></div>` : ""}
      <div class="flex gap-2">
        <button type="submit" class="${c.button}">Submit</button>
        <button type="reset" class="${c.button}">Reset</button>
      </div>
    </form>
  `
}

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/field")
  await import("@ui-sdk/web/file-input")
  renderShell(root, (slot, variant, log) => {
    slot.innerHTML = markup(variant)
    const input = slot.querySelector<UiFileInputElement>("ui-file-input")!
    // Web components hold their own value, so "controlled" sets it back from the event.
    Object.assign(input, {
      validate: variant.validate ? validateName : undefined,
      announcement: announcementFor(variant),
    })
    const controller = createFileInputController()
    if (variant.controller) {
      input.controller = controller
    }
    slot
      .querySelector("[data-add]")
      ?.addEventListener("click", () => controller.addFiles([sampleFile()]))
    slot
      .querySelector("[data-open]")
      ?.addEventListener("click", () => controller.open())
    slot
      .querySelector("[data-clear]")
      ?.addEventListener("click", () => controller.clear())
    for (const el of slot.querySelectorAll<UiFileInputElement>(
      "ui-file-input"
    )) {
      const prefix = el.hasAttribute("data-inner") ? "inner " : ""
      el.addEventListener("valuechange", (event) => {
        if (event.target === el) {
          log(`${prefix}${describe(event.detail)}`)
        }
      })
      el.addEventListener("reject", (event) => {
        if (event.target === el) {
          log(
            `${prefix}${describe({ reason: event.detail.reason, rejected: event.detail.value })}`
          )
        }
      })
    }
  })
}

export { mount }
