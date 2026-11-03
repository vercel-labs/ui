import "@ui-sdk/web/dialog"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <ui-dialog>
        <ui-dialog-trigger><button>Invite</button></ui-dialog-trigger>
        <ui-dialog-backdrop></ui-dialog-backdrop>
        <ui-dialog-content initial-focus="[name=email]" final-focus="[data-next-step]">
          <div data-slot="stack">
            <ui-dialog-title>Invite a teammate</ui-dialog-title>
            <ui-dialog-description>Focus starts on the email.</ui-dialog-description>
          </div>
          <div data-slot="stack">
            <label data-slot="label">
              Name
              <input name="name" value="Ada" />
            </label>
            <label data-slot="label">
              Email
              <input name="email" type="email" />
            </label>
          </div>
          <div data-slot="row">
            <ui-dialog-close><button data-variant="solid">Send invite</button></ui-dialog-close>
          </div>
        </ui-dialog-content>
      </ui-dialog>
      <button type="button" data-next-step>Next step</button>
    </div>
  `
}

export { mount }
