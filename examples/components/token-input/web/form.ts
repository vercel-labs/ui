import { toText, type TokenInputValue } from "@ui-sdk/core/token-input"
import "@ui-sdk/web/token-input"

const draft: TokenInputValue = [
  "Explain ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " in two sentences.",
]

let count = 0
export function mount(root: HTMLElement) {
  const formId = `token-input-form-${++count}`
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        <label data-slot="label"><input type="checkbox" data-option="disabled" /> Disabled</label>
        <label data-slot="label"><input type="checkbox" data-option="read-only" /> Read-only</label>
      </div>
      <ui-token-input form="${formId}" name="prompt" required value="${toText(draft).replaceAll('"', "&quot;")}">
        <label id="${formId}-label" data-slot="label">Prompt</label>
        <ui-token-input-editor aria-labelledby="${formId}-label"></ui-token-input-editor>
      </ui-token-input>
      <form id="${formId}" data-slot="stack">
        <div data-slot="row">
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>
        <p data-slot="output"></p>
      </form>
    </div>
  `
  const input = root.querySelector("ui-token-input")!
  const form = root.querySelector("form")!
  for (const box of root.querySelectorAll<HTMLInputElement>("[data-option]"))
    box.addEventListener("change", () => input.toggleAttribute(box.dataset.option!, box.checked))
  form.addEventListener("reset", () => {
    root.querySelector("p")!.textContent = ""
  })
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector("p")!.textContent = String(new FormData(form).get("prompt") ?? "")
  })
}
