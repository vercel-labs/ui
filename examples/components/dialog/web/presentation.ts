import "@ui-sdk/web/dialog"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-dialog presentation="sheet">
      <ui-dialog-trigger><button>Edit profile</button></ui-dialog-trigger>
      <ui-dialog-content>
        <div data-slot="stack">
          <ui-dialog-title>Edit profile</ui-dialog-title>
          <ui-dialog-description>Make changes to your profile here. Click save when you're done.</ui-dialog-description>
        </div>
        <div data-slot="stack">
          <label data-slot="label">
            Name
            <input value="Hollis Grant" />
          </label>
          <label data-slot="label">
            Username
            <input value="@hollis" />
          </label>
        </div>
        <div data-slot="row">
          <ui-dialog-close><button>Cancel</button></ui-dialog-close>
          <ui-dialog-close value="save"><button data-variant="solid">Save changes</button></ui-dialog-close>
        </div>
      </ui-dialog-content>
    </ui-dialog>
  `
}

export { mount }
