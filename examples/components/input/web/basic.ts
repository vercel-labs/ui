import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-input>
      <input aria-label="Email" type="email" placeholder="Email" />
    </ui-input>
  `
}
