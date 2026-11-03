import "@ui-sdk/web/separator"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="stack">
        <p>Account</p>
        <p data-slot="hint">Manage your profile and preferences.</p>
      </div>
      <ui-separator></ui-separator>
      <p>Your changes are saved automatically.</p>
    </div>
  `
}
