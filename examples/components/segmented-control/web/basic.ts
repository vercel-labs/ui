import "@ui-sdk/web/segmented-control"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-segmented-control aria-label="View" default-value="list">
      <ui-segmented-control-indicator></ui-segmented-control-indicator>
      <ui-segmented-control-item value="list">List</ui-segmented-control-item>
      <ui-segmented-control-item value="grid">Grid</ui-segmented-control-item>
      <ui-segmented-control-item value="board">Board</ui-segmented-control-item>
    </ui-segmented-control>
  `
}

export { mount }
