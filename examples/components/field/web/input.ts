import "@ui-sdk/web/field"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-field>
        <ui-field-label>Username</ui-field-label>
        <input name="username" placeholder="hollis" autocomplete="username" />
        <ui-field-description>Choose a unique username for your account.</ui-field-description>
      </ui-field>
    </div>
  `
}

export { mount }
