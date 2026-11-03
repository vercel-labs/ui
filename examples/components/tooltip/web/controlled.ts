import "@ui-sdk/web/tooltip"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        <ui-tooltip>
          <ui-tooltip-trigger><button>Export</button></ui-tooltip-trigger>
          <ui-tooltip-content>Download a CSV of this table</ui-tooltip-content>
        </ui-tooltip>
        <button type="button" data-show>Show from elsewhere</button>
      </div>
      <output data-slot="output">Closed</output>
    </div>
  `
  const tooltip = root.querySelector("ui-tooltip")!
  root.querySelector("[data-show]")!.addEventListener("click", () => tooltip.api.open())
  tooltip.addEventListener("openchange", (event) => {
    const { value, reason } = event.detail
    root.querySelector("output")!.textContent = `${value ? "Open" : "Closed"}, last change: ${reason}`
  })
}

export { mount }
