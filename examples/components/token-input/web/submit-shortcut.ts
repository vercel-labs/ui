import { toLabel } from "@ui-sdk/core/token-input"
import "@ui-sdk/web/token-input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-token-input submit-shortcut="mod+enter">
        <ui-token-input-editor aria-label="Message" placeholder="Enter adds a line, Cmd/Ctrl+Enter sends"></ui-token-input-editor>
      </ui-token-input>
      <p data-slot="output">Nothing sent yet.</p>
    </form>
  `
  const form = root.querySelector("form")!
  const input = root.querySelector("ui-token-input")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector("p")!.textContent = `Sent:\n${toLabel(input.api.getValue())}`
  })
}
