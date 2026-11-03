import "@ui-sdk/web/menu"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-menu>
        <ui-menu-trigger>
          <button>Project</button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-group>
            <ui-menu-group-label>Project</ui-menu-group-label>
            <ui-menu-item value="overview">Overview</ui-menu-item>
            <ui-menu-item value="members">Members</ui-menu-item>
            <ui-menu-item value="settings">Settings</ui-menu-item>
          </ui-menu-group>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-group>
            <ui-menu-group-label>Help</ui-menu-group-label>
            <ui-menu-item value="docs">Documentation</ui-menu-item>
            <ui-menu-item value="feedback">Send feedback</ui-menu-item>
          </ui-menu-group>
        </ui-menu-content>
      </ui-menu>
      <output data-slot="output">Pick an item</output>
    </div>
  `
  root.addEventListener(
    "action",
    (event) => {
      root.querySelector("output")!.textContent =
        `Ran ${(event as CustomEvent<{ value: string }>).detail.value}`
    },
    { capture: true },
  )
}

export { mount }
