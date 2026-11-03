import "@ui-sdk/web/dialog"
import "@ui-sdk/web/drawer"

function mount(root: HTMLElement) {
  const query = window.matchMedia("(min-width: 768px)")
  const render = () => {
    root.innerHTML = query.matches
      ? `
        <ui-dialog>
          <ui-dialog-trigger><button>Edit profile</button></ui-dialog-trigger>
          <ui-dialog-backdrop></ui-dialog-backdrop>
          <ui-dialog-content>
            <div data-slot="stack">
              <ui-dialog-title>Edit profile</ui-dialog-title>
              <ui-dialog-description>Make changes to your profile here. Save when you're done.</ui-dialog-description>
            </div>
            <div data-slot="stack">
              <label data-slot="label">
                Email
                <input type="email" value="shadcn@example.com" />
              </label>
              <label data-slot="label">
                Username
                <input value="@shadcn" />
              </label>
            </div>
            <ui-dialog-close><button data-variant="solid">Save changes</button></ui-dialog-close>
          </ui-dialog-content>
        </ui-dialog>
      `
      : `
        <ui-drawer>
          <ui-drawer-trigger><button>Edit profile</button></ui-drawer-trigger>
          <ui-drawer-backdrop></ui-drawer-backdrop>
          <ui-drawer-content>
            <div data-slot="grip" aria-hidden="true"></div>
            <div data-slot="stack">
              <ui-drawer-title>Edit profile</ui-drawer-title>
              <ui-drawer-description>Make changes to your profile here. Save when you're done.</ui-drawer-description>
            </div>
            
              <div data-slot="stack">
                <label data-slot="label">
                  Email
                  <input type="email" value="shadcn@example.com" />
                </label>
                <label data-slot="label">
                  Username
                  <input value="@shadcn" />
                </label>
              </div>
            
            <div data-slot="stack">
              <ui-drawer-close><button data-variant="solid">Save changes</button></ui-drawer-close>
              <ui-drawer-close><button>Cancel</button></ui-drawer-close>
            </div>
          </ui-drawer-content>
        </ui-drawer>
      `
  }
  render()
  query.addEventListener("change", render)
  return () => query.removeEventListener("change", render)
}

export { mount }
