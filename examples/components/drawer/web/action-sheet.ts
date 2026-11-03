import "@ui-sdk/web/drawer"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <button type="button">Photo options</button>
      <span data-slot="hint" role="status"></span>
      <ui-drawer>
        <ui-drawer-backdrop></ui-drawer-backdrop>
        <ui-drawer-content>
          <div data-slot="stack">
            <div data-slot="stack">
              <ui-drawer-title>Beach.jpg</ui-drawer-title>
              <ui-drawer-description>Taken today at 9:41.</ui-drawer-description>
            </div>
            <div data-slot="stack">
              <ui-drawer-close value="share"><button>Share</button></ui-drawer-close>
              <ui-drawer-close value="duplicate"><button>Duplicate</button></ui-drawer-close>
              <ui-drawer-close value="delete"><button>Delete</button></ui-drawer-close>
            </div>
          </div>
          <ui-drawer-close value="cancel"><button>Cancel</button></ui-drawer-close>
        </ui-drawer-content>
      </ui-drawer>
    </div>
  `
  const drawer = root.querySelector("ui-drawer")!
  const status = root.querySelector('[role="status"]')!
  root.querySelector("button")!.addEventListener("click", async () => {
    const { returnValue = "cancel" } = await drawer.api.open()
    status.textContent = returnValue === "cancel" ? "Canceled" : `Chose ${returnValue}`
  })
}

export { mount }
