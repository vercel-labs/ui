import "@ui-sdk/web/dialog"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-dialog>
      <ui-dialog-trigger><button>Account</button></ui-dialog-trigger>
      <ui-dialog-backdrop></ui-dialog-backdrop>
      <ui-dialog-content>
        <div data-slot="stack">
          <ui-dialog-title>Account</ui-dialog-title>
          <ui-dialog-description>Manage how you sign in.</ui-dialog-description>
        </div>
        <div data-slot="row">
          <ui-dialog>
            <ui-dialog-trigger><button>Change password</button></ui-dialog-trigger>
            <ui-dialog-backdrop></ui-dialog-backdrop>
            <ui-dialog-content>
              <div data-slot="stack">
                <ui-dialog-title>Change password</ui-dialog-title>
                <ui-dialog-description>Use at least 12 characters.</ui-dialog-description>
              </div>
              <label data-slot="label">
                New password
                <input type="password" />
              </label>
              <div data-slot="row">
                <ui-dialog-close><button>Cancel</button></ui-dialog-close>
                <ui-dialog-close><button data-variant="solid">Update</button></ui-dialog-close>
              </div>
            </ui-dialog-content>
          </ui-dialog>
          <ui-dialog-close><button data-variant="solid">Done</button></ui-dialog-close>
        </div>
      </ui-dialog-content>
    </ui-dialog>
  `
}

export { mount }
