import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-resizable>
        <ui-resizable-panel>Fixed</ui-resizable-panel>
        <ui-resizable-handle disabled aria-label="Resize fixed"></ui-resizable-handle>
        <ui-resizable-panel>Two</ui-resizable-panel>
        <ui-resizable-handle aria-label="Resize two"></ui-resizable-handle>
        <ui-resizable-panel>Three</ui-resizable-panel>
      </ui-resizable>
      <label data-slot="label">
        <input type="checkbox" />
        Disable the group
      </label>
    </div>
  `
  const group = root.querySelector("ui-resizable")!
  const toggle = root.querySelector<HTMLInputElement>("input")!
  toggle.addEventListener("change", () => group.toggleAttribute("disabled", toggle.checked))
}

export { mount }
