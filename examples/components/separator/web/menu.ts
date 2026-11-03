import "@ui-sdk/web/separator"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <div data-slot="stack">
        <span>Settings</span>
        <span data-slot="hint">Manage preferences</span>
      </div>
      <ui-separator orientation="vertical"></ui-separator>
      <div data-slot="stack">
        <span>Account</span>
        <span data-slot="hint">Profile &amp; security</span>
      </div>
      <ui-separator orientation="vertical"></ui-separator>
      <div data-slot="stack">
        <span>Help</span>
        <span data-slot="hint">Support &amp; docs</span>
      </div>
    </div>
  `
}
