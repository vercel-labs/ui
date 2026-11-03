import "@ui-sdk/web/field"
import "@ui-sdk/web/textarea"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-field name="message">
        <ui-field-label>Message</ui-field-label>
        <ui-textarea auto-resize>
          <textarea required></textarea>
        </ui-textarea>
      </ui-field>
      <button type="submit">Send message</button>
      <p data-slot="output">Nothing sent yet.</p>
    </form>
  `
  const message = root.querySelector("ui-textarea")!
  const sent: string[] = []
  root.querySelector("form")!.addEventListener("submit", (event) => {
    event.preventDefault()
    sent.push(String(new FormData(event.currentTarget as HTMLFormElement).get("message")))
    root.querySelector("p")!.textContent = `Sent: ${sent.at(-1)}`
    message.api.clear()
  })
}
