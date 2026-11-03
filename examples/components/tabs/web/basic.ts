import "@ui-sdk/web/tabs"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-tabs default-value="account">
      <ui-tabs-list aria-label="Settings">
        <ui-tabs-tab value="account">
          <button type="button">Account</button>
        </ui-tabs-tab>
        <ui-tabs-tab value="password">
          <button type="button">Password</button>
        </ui-tabs-tab>
      </ui-tabs-list>
      <ui-tabs-panel value="account">Manage your name, email address, and profile.</ui-tabs-panel>
      <ui-tabs-panel value="password">Choose a new password for your account.</ui-tabs-panel>
    </ui-tabs>
  `
}

export { mount }
