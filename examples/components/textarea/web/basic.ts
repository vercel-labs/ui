import "@ui-sdk/web/textarea"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-textarea>
      <textarea aria-label="Message" placeholder="Type your message here."></textarea>
    </ui-textarea>
  `
}
