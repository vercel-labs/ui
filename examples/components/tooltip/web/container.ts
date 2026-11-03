import "@ui-sdk/web/tooltip"

function mount(root: HTMLElement) {
  const id = `tooltip-${crypto.randomUUID()}`
  root.innerHTML = `
    <div data-slot="stack">
      <ui-tooltip container="#${id}-container">
        <ui-tooltip-trigger><button>Show in the box</button></ui-tooltip-trigger>
        <ui-tooltip-content>This tooltip is in the box below, in the DOM.</ui-tooltip-content>
      </ui-tooltip>
      <div data-slot="card">Container<div id="${id}-container"></div></div>
    </div>
  `
}

export { mount }
