import "@ui-sdk/web/field"
import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-field name="message">
        <ui-field-label>Message</ui-field-label>
        <ui-input>
          <input placeholder="Say something" />
        </ui-input>
      </ui-field>
      <div data-slot="row">
        <button type="button" data-action="reply">Quick reply</button>
        <button type="button" data-action="clear">Clear</button>
        <button type="button" data-action="focus">Focus</button>
      </div>
    </div>
  `
  const message = root.querySelector("ui-input")!
  const actions: Record<string, () => void> = {
    reply: () => message.api.setValue("On my way!"),
    clear: () => message.api.clear(),
    focus: () => message.api.focus(),
  }
  for (const button of root.querySelectorAll<HTMLElement>("[data-action]"))
    button.addEventListener("click", () => actions[button.dataset.action!]())
}
