import "@ui-sdk/web/field"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-field>
        <ui-field-label>Username</ui-field-label>
        <input name="username" placeholder="ada" autocomplete="username" />
        <ui-field-description>Choose a unique username for your account.</ui-field-description>
      </ui-field>

    </div>
  `
}
