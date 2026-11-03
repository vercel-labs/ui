import "@ui-sdk/web/menu"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        <ui-menu>
          <ui-menu-trigger>
            <button>Actions</button>
          </ui-menu-trigger>
          <ui-menu-content>
            <ui-menu-item value="rename">Rename</ui-menu-item>
            <ui-menu-item value="duplicate">Duplicate</ui-menu-item>
            <ui-menu-item value="archive">Archive</ui-menu-item>
          </ui-menu-content>
        </ui-menu>
        <button data-variant="ghost" value="state">Open with state</button>
        <button data-variant="ghost" value="controller">Open with the controller</button>
      </div>

      <output data-slot="output">Closed</output>
    </div>
  `
  const menu = root.querySelector("ui-menu")!
  root.querySelector("button[value=state]")!.addEventListener("click", () => (menu.open = true))
  root
    .querySelector("button[value=controller]")!
    .addEventListener("click", () => menu.api.open({ focus: "first" }))

  menu.addEventListener("openchange", (event) => {
    const { value, reason } = event.detail
    root.querySelector("output")!.textContent = `${value ? "Open" : "Closed"}, last change: ${reason}`
  })
}

export { mount }
