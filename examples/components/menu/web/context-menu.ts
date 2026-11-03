import "@ui-sdk/web/menu"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-menu>
        <ui-menu-context-trigger tabindex="0">Right-click or long-press here</ui-menu-context-trigger>
        <ui-menu-content>
          <ui-menu-item value="back">Back</ui-menu-item>
          <ui-menu-item value="forward" disabled>Forward</ui-menu-item>
          <ui-menu-item value="reload">Reload</ui-menu-item>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-item value="save">Save page as…</ui-menu-item>
          <ui-menu-item value="print">Print…</ui-menu-item>
        </ui-menu-content>
      </ui-menu>
      <output data-slot="output">No action yet</output>
    </div>
  `
  root.addEventListener(
    "action",
    (event) => {
      const { value } = (event as CustomEvent<{ value: string }>).detail
      root.querySelector("output")!.textContent = `Last action: ${value}`
    },
    { capture: true },
  )
}

export { mount }
