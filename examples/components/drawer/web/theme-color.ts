import "@ui-sdk/web/drawer"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-drawer theme-color>
        <ui-drawer-trigger><button>Dim the toolbar</button></ui-drawer-trigger>
        <ui-drawer-backdrop></ui-drawer-backdrop>
        <ui-drawer-content>
          <div data-slot="grip" aria-hidden="true"></div>
          <div data-slot="stack">
            <ui-drawer-title>Theme color</ui-drawer-title>
            <ui-drawer-description>On an iPhone, Safari's toolbars dim with the page. The drawer writes the color where motion starts and ends, never on every frame.</ui-drawer-description>
          </div>
          <div data-slot="stack">
            <ui-drawer-close><button data-variant="solid">Close</button></ui-drawer-close>
          </div>
        </ui-drawer-content>
      </ui-drawer>
      <p data-slot="row">
        <span data-slot="swatch" aria-hidden="true"></span>
        <span>theme-color: <span data-color></span></span>
      </p>
    </div>
  `
  const existing = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  const meta =
    existing ?? Object.assign(document.createElement("meta"), { name: "theme-color", content: "#ffffff" })
  if (!existing) document.head.append(meta)
  const swatch = root.querySelector<HTMLElement>('[data-slot="swatch"]')!
  const label = root.querySelector("[data-color]")!
  const read = () => {
    swatch.style.background = meta.content
    label.textContent = meta.content
  }
  read()
  const observer = new MutationObserver(read)
  observer.observe(meta, { attributes: true, attributeFilter: ["content"] })
  return () => {
    observer.disconnect()
    if (!existing) meta.remove()
  }
}

export { mount }
