import type { UiFileInputElement } from "@ui-sdk/web"
import {
  describeChange,
  fileInputFixture as f,
  fileInputOptions,
  serializeFiles,
} from "tests/fixtures/file-input.ts"

const attr = (name: string, on: boolean | undefined) => (on ? ` ${name}` : "")

function markup(options: ReturnType<typeof fileInputOptions>) {
  const name = options.name ? ` name="${options.name}"` : ""
  return `
    <div class="fixture">
      <button>Before</button>
      <form class="form" id="${f.formId}" aria-label="${f.formLabel}">
        <ui-field>
          <ui-field-label>${f.field.label}</ui-field-label>
          <ui-file-input class="file-input" data-kind="attachments"${name} accept="${f.attachments.accept}" max-files="${options.maxFiles}" max-size="${f.attachments.maxSize}" min-size="${f.attachments.minSize}"${attr("multiple", options.multiple)}${attr("required", options.required)}${attr("disabled", options.disabled)}>
            <ui-file-input-dropzone class="zone" role="group" aria-label="${f.zone.label}" paste-target="#note">
              <p>${f.zone.text}</p>
              <ui-file-input-trigger><button>${f.trigger.label}</button></ui-file-input-trigger>
            </ui-file-input-dropzone>
            <ui-file-input-list aria-label="${f.list.label}" class="file-list">
              <template>
                <ui-file-input-item class="file-item">
                  <span data-file="name"></span>
                  <ui-file-input-item-remove><button type="button">×</button></ui-file-input-item-remove>
                </ui-file-input-item>
              </template>
            </ui-file-input-list>
          </ui-file-input>
          <ui-field-description>${f.field.description}</ui-field-description>
          <ui-field-error class="field-error" match="valueMissing">${f.field.error}</ui-field-error>
        </ui-field>
        <label>${f.note.label}<textarea id="note" name="${f.note.name}"></textarea></label>
        <div class="row">
          <button type="submit">Send</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <ui-file-input data-kind="avatar" accept="${f.avatar.accept}" capture="${f.avatar.capture}">
        <ui-file-input-trigger><button>${f.avatar.label}</button></ui-file-input-trigger>
      </ui-file-input>
      <ui-file-input data-kind="folder" directory>
        <ui-file-input-trigger><button>${f.folder.label}</button></ui-file-input-trigger>
      </ui-file-input>
      ${
        options.page
          ? `<ui-file-input data-kind="page" multiple>
              <ui-file-input-dropzone class="page-zone" role="group" aria-label="${f.page.label}" target="document">${f.page.text}</ui-file-input-dropzone>
            </ui-file-input>`
          : ""
      }
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output role="status" aria-label="Actions">0</output>
      <output role="status" aria-label="Submitted"></output>
    </div>
  `
}

async function mount(root: HTMLElement) {
  const options = fileInputOptions()
  await import("@ui-sdk/web/field")
  await import("@ui-sdk/web/file-input")
  root.innerHTML = markup(options)
  const [action, count, submitted] = Array.from(root.querySelectorAll("output"))
  // A change counts as an action, and shows its rejections too. Rejections
  // without a change only show. Both events fire in the same task.
  let changed = false
  for (const el of root.querySelectorAll<UiFileInputElement>("ui-file-input")) {
    const kind = el.dataset.kind ?? ""
    el.addEventListener("valuechange", (event) => {
      if (options.cancel) {
        event.preventDefault()
      }
      changed = true
      queueMicrotask(() => (changed = false))
      action.textContent = describeChange(kind, event.detail)
      count.textContent = String(Number(count.textContent) + 1)
    })
    el.addEventListener("reject", (event) => {
      if (changed) {
        return
      }
      action.textContent = describeChange(kind, {
        reason: event.detail.reason,
        rejected: event.detail.value,
      })
    })
  }
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    submitted.textContent = serializeFiles(form)
  })
}

export { mount }
