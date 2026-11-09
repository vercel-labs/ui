async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-menu>
        <ui-menu-trigger><button>File</button></ui-menu-trigger>
        <ui-menu-content class="popup">
          <ui-menu-item value="docs" as-child><a class="item" href="#docs">Docs</a></ui-menu-item>
          <ui-menu-item class="item" value="plain">Plain</ui-menu-item>
        </ui-menu-content>
      </ui-menu>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  await import("@ui-sdk/web/menu")
  root.addEventListener(
    "action",
    (event) => {
      root.querySelector("output")!.textContent = (
        event as CustomEvent<{ value: string }>
      ).detail.value
    },
    { capture: true }
  )
}

export { mount }
