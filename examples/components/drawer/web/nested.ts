import "@ui-sdk/web/drawer"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-drawer>
      <ui-drawer-trigger><button>Account</button></ui-drawer-trigger>
      <ui-drawer-backdrop></ui-drawer-backdrop>
      <ui-drawer-content>
        <div data-slot="grip" aria-hidden="true"></div>
        <div data-slot="stack">
          <ui-drawer-title>Account</ui-drawer-title>
          <ui-drawer-description>Manage how you sign in.</ui-drawer-description>
        </div>
        <dl>
          <div data-slot="row">
            <dt>Email</dt>
            <dd>ada@example.com</dd>
          </div>
          <div data-slot="row">
            <dt>Password</dt>
            <dd>Changed 3 months ago</dd>
          </div>
          <div data-slot="row">
            <dt>Two-factor</dt>
            <dd>On</dd>
          </div>
        </dl>
        <div data-slot="stack">
          <ui-drawer>
            <ui-drawer-trigger><button>Change password</button></ui-drawer-trigger>
            <ui-drawer-backdrop></ui-drawer-backdrop>
            <ui-drawer-content>
              <div data-slot="grip" aria-hidden="true"></div>
              <div data-slot="stack">
                <ui-drawer-title>Change password</ui-drawer-title>
                <ui-drawer-description>Use at least 12 characters.</ui-drawer-description>
              </div>
              <label data-slot="label">
                New password
                <input type="password" />
              </label>
              <div data-slot="stack">
                <ui-drawer-close><button data-variant="solid">Update</button></ui-drawer-close>
              </div>
            </ui-drawer-content>
          </ui-drawer>
          <ui-drawer-close><button data-variant="solid">Done</button></ui-drawer-close>
        </div>
      </ui-drawer-content>
    </ui-drawer>
  `
}

export { mount }
