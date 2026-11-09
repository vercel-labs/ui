import { toText, type TokenInputValue } from "@ui-sdk/core/token-input"
import {
  pendingSelect,
  tokenInputFixture as f,
  tokenInputOptions,
  tokenTriggers,
} from "tests/fixtures/token-input.ts"

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/token-input")
  await import("@ui-sdk/web/trigger-menu")
  const {
    value,
    pending,
    fail,
    tokenDeletion,
    submitShortcut,
    copy,
    disabled,
    readOnly,
    otherForm,
  } = tokenInputOptions()
  const template = document.createElement("template")
  template.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <form class="composer" aria-label="${f.formLabel}">
        <ui-token-input name="${f.name}"${otherForm ? ' form="other"' : ""}${disabled ? " disabled" : ""}${readOnly ? " read-only" : ""}>
          <label class="label" id="prompt-label">${f.label}</label>
          <ui-token-input-editor class="editor" aria-labelledby="prompt-label" placeholder="${f.placeholder}"></ui-token-input-editor>
          <template><ui-token-input-token class="token"><span data-token-label></span><ui-token-input-token-remove> ×</ui-token-input-token-remove></ui-token-input-token></template>
          <ui-trigger-menu>
            <ui-trigger-menu-hint class="hint"></ui-trigger-menu-hint>
            <ui-trigger-menu-content class="popup list-popup">
              <ui-trigger-menu-list></ui-trigger-menu-list>
            </ui-trigger-menu-content>
            <template><ui-trigger-menu-item class="item"></ui-trigger-menu-item></template>
          </ui-trigger-menu>
        </ui-token-input>
        <button type="submit">${f.submit}</button>
      </form>
      ${otherForm ? `<form id="other" aria-label="Other"></form>` : ""}
      <textarea aria-label="${f.scratch}"></textarea>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output role="status" aria-label="Submitted"></output>
    </div>`
  // URL options go in as attributes, never as markup, so a crafted URL can't add elements.
  const tokens = template.content.querySelector("ui-token-input")!
  if (tokenDeletion) {
    tokens.setAttribute("token-deletion", tokenDeletion)
  }
  if (submitShortcut) {
    tokens.setAttribute("submit-shortcut", submitShortcut)
  }
  if (copy) {
    tokens.setAttribute("copy", copy)
  }
  root.replaceChildren(template.content)
  const input = root.querySelector("ui-token-input")!
  if (value) {
    input.setAttribute("value", value)
  }
  const menu = root.querySelector("ui-trigger-menu")!
  menu.triggers = tokenTriggers()
  menu.addEventListener("itemselect", (event) => {
    if (pending && event.detail.trigger === "@") {
      event.detail.waitUntil(pendingSelect({ fail }))
    }
  })
  const output = (name: string) =>
    root.querySelector<HTMLOutputElement>(`output[aria-label="${name}"]`)!
  input.addEventListener("valuechange", (event) => {
    output("Last action").textContent =
      `${event.detail.reason}:${toText(event.detail.value as TokenInputValue)}`
  })
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    output("Submitted").textContent = String(new FormData(form).get(f.name))
  })
  const other = root.querySelector<HTMLFormElement>("#other")
  other?.addEventListener("submit", (event) => {
    event.preventDefault()
    output("Submitted").textContent = `other:${new FormData(other).get(f.name)}`
  })
}

export { mount }
