import "@ui-sdk/web/tooltip"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-tooltip>
      <ui-tooltip-trigger><button>Hover</button></ui-tooltip-trigger>
      <ui-tooltip-content>Add to library</ui-tooltip-content>
    </ui-tooltip>
  `
}

export { mount }
