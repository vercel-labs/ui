import "@ui-sdk/web/separator"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <span>Profile</span>
      <ui-separator orientation="vertical"></ui-separator>
      <span>Billing</span>
      <ui-separator orientation="vertical"></ui-separator>
      <span>Settings</span>
    </div>
  `
}
